import { Core, CoreLog } from "../index";
import { LoggerProxy } from "../core-lib/core-log-ts-log";

export interface SandboxType {
    moduleID: string;
    /*|| jquery dom ||*/
    find(selector: string): HTMLElement;
    find_all(selector: string): HTMLElement[];
    create_el(tag: string, config: {}): HTMLElement;
    /*|| typescript-logging ||*/
    getLogger(): LoggerProxy;
    /*|| pub-sub ||*/
    add_trigger(listener: { el: HTMLElement | Array<HTMLElement>, event_type: string, handler: any, target: string }): void;
    remove_trigger(listener: { el: HTMLElement | Array<HTMLElement>, event_type: string, handler: any, target: string }): void;

    publish(eventInfo: { event_name: string, data: {} }): void;
    subscribe(observable: Array<Observable>): void;
}

export interface Observable {
    name: string;
    handler: Function;
}

export interface EventInfo {
    event_name: string; 
    data: Object
}

export const Sandbox = (core: Core, moduleID: string, page_name?: string) => {
    return new (class _Sandbox implements SandboxType {
        core: Core;
        moduleID: string;
        container: HTMLElement;
        logger: LoggerProxy;
        constructor(core: Core, module_name: string, page_name?: string) {
            const logger = this.logger = core.log.getLogger({ page_name, module_name });
            this.moduleID = moduleID;
            this.container = core.dom.search('#' + moduleID);
            this.core = core;
        }
        create_el(tag: string, config: { [name: string]: string, text?: string}) {
            let el: HTMLElement = document.createElement(tag);
            return this.core.dom.make_el(tag, config);
        }
        subscribe(observables: Observable[]): void {
            observables.forEach((o: Observable) => {
                this.core.link({ subscriber: moduleID, observable: o });
            });
        }
        publish(eventInfo: { event_name: string; data: string; }): void {
            this.core.push(eventInfo);
        }
        add_trigger(listener: { el: HTMLElement | HTMLElement[]; event_type: string; handler: Function; target: string | null; }) {
            this.core.dom.tie(listener);
        }
        remove_trigger(listener: { el: HTMLElement | HTMLElement[]; event_type: string; handler: Function ; target: string | null; }) {
            this.core.dom.untie(listener);
        }
        getLogger() {
            return this.logger;
        }
        find(selector: string): HTMLElement {
            return core.dom.search(selector);
        }
        find_all(selector: string): HTMLElement[] {
            return core.dom.search_all(selector);
        }
    })(core, moduleID, page_name);
}
