import { Sandbox, Observable, SandboxType } from "./sandbox";
import { DepType, CoreDom, CoreLog } from "../index";
import { createLogger } from "../core-lib/core-log-ts-log";

const logger = createLogger("CORE");

export interface LoaderType {
  dock: Function;
  update: Function;
  load: Function;
  unload: Function;
}

export interface ModuleType {
  type: DepType,
  name: string,
  loader: (sandbox: SandboxType) => LoaderType
}

export interface Dependency {
  type: DepType;
  name: string;
  loader: Function;
  instance?: any;
  subscriptions?: Observable[];
  version?: string;
}

export interface Core {
  dom?: CoreDom;
  log?: CoreLog;
  /* || lib, module management || */
  add_dependency(page_name: string, deps: Dependency): void;
  /* || module messages mediation || */
  push(eventInfo: { event_name: string, data: string }): void;
  link(subscription: { subscriber: string, observable: Observable | Observable[] }): void;
}

export interface Option {
  [name: string]: {
    [name: string]: {
      libs: Dependency[],
      mods: Dependency[]
    }
  }
}

export namespace Corel {
  class AppManager {
    option: Option;
    constructor(option: Option) {
      this.option = option;
    }
    create(page: string) {
      return create(this.option[page]);
    }
  }
  export const set = (option: Option) => new AppManager(option);
  export const create =
    (option: { [name: string]: { libs: Dependency[], mods: Dependency[] } }) =>
      new (class _Core implements Core {
        dom: CoreDom;
        log: CoreLog;
        data: {
          [name: string]: {
            libraryMap: Map<string, Dependency>;
            moduleMap: Map<string, Dependency>;
          }
        };
        constructor(option: { [name: string]: { libs: Dependency[], mods: Dependency[] } }) {
          this.data = {}
          for (var page_name in option) {
            let { libs, mods } = option[page_name];
            let libraryMap = libs.reduce((acc: Map<string, Dependency>, curr) => { acc.set(curr.name, curr); return acc; }, new Map<string, Dependency>());
            let moduleMap = mods.reduce((acc: Map<string, Dependency>, curr) => { acc.set(curr.name, curr); return acc; }, new Map<string, Dependency>());
            this.data[page_name] = { libraryMap, moduleMap };
            libs.forEach(l => this.add_dependency(page_name, l))
            mods.forEach(m => this.add_dependency(page_name, m))
          }
        }
        link(subscription: { subscriber: string; observable: Observable; }): void {
          let { subscriber, observable } = subscription;
          for (var page_name in this.data) {
            let { moduleMap } = this.data[page_name];
            moduleMap.get(subscriber).subscriptions.push(observable);
          }
        }
        push(eventInfo: { event_name: string; data: string; }): void {
          let { event_name, data } = eventInfo;
          // logger.trace(`(event: "${event_name}"), (data: "${data}")`);
          for (var page_name in this.data) {
            let { moduleMap } = this.data[page_name];
            moduleMap.forEach(module => {
              module.subscriptions.filter((o: Observable) => o.name === event_name).forEach((o: Observable) => o.handler(data));
            });
          }

        }
        start(moduleID: string, page_name?: string) {
          let mod;
          if (!page_name) {
            for (var page_name in this.data) {
              mod = this.data[page_name].moduleMap.get(moduleID);
            }
          } else {
            mod = this.data[page_name].moduleMap.get(moduleID);
            mod.subscriptions = [];
          }
          let { instance, loader } = mod;
          let module_body: { dock: Function, load: Function } = instance = loader(Sandbox(this, moduleID, page_name));
          module_body.dock();
        }

        start_all() {
          for (var page_name in this.data) {
            this.data[page_name].moduleMap.forEach((module, module_name) => {
              this.start(module_name, page_name);
            })
          }
        }

        add_dependency(page_name: string, deps: Dependency): void {
          switch (deps.type) {
            case DepType.LIBRARY: {
              let { libraryMap } = this.data[page_name];
              let { name, version } = deps;
              libraryMap.set(name, deps);
              libraryMap.forEach(l => l.loader(this));
              break;
            }
            case DepType.MODULE: {
              let { moduleMap } = this.data[page_name];
              let { name } = deps;
              moduleMap.set(name, deps);
              break;
            }
          }
        }
      })(option);
}
