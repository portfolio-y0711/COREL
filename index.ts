export enum DepType {
  LIBRARY,
  MODULE
}

export { Logger } from "typescript-logging";

export { SandboxType, Observable } from "./app/sandbox";
export { Dependency, Core, Corel, LoaderType, ModuleType, Option } from "./app/core";

export { CoreLog, ts_log } from "./core-lib/core-log-ts-log";
export { CoreDom, jquery_dom } from "./core-lib/core-dom-jquery";
