import { LoggerFactoryOptions, LFService, LogGroupRule, LogLevel } from "typescript-logging";
import { MessageType, Logger as tsLogger } from "typescript-logging";
import { DepType, Core } from "../index"

const options = new LoggerFactoryOptions()
    .addLogGroupRule(new LogGroupRule(new RegExp("Dev/+"), LogLevel.Trace))
    .addLogGroupRule(new LogGroupRule(new RegExp("err/+"), LogLevel.Trace))
    .addLogGroupRule(new LogGroupRule(new RegExp(".+"), LogLevel.Trace));

export const factory = LFService.createNamedLoggerFactory("LoggerFactory", options);

export interface LoggerProxy {
    logger: tsLogger;
    name: string
    is_mute: boolean;
    mute(): void;
    unmute(): void;
    debug(msg: MessageType): void; 
    trace(msg: MessageType): void; 
    info(msg: MessageType): void; 
    warn(msg: MessageType): void; 
    getLogLevel(): LogLevel;
}


export interface CoreLog {
  getLogger: (option: { page_name: string, module_name: string }) => LoggerProxy
}

const custom_logger = class {
    logger: tsLogger;
    name: string
    is_mute: boolean = false;
    constructor(logger: tsLogger) { 
        this.logger = logger;
        this.name = logger.name;
    }
    mute(){ this.is_mute = true; }
    unmute(){ this.is_mute = false; }
    debug(msg: MessageType) { !this.is_mute && this.logger.debug(`${msg}`) };
    trace = (msg: MessageType) => { !this.is_mute && this.logger.trace(`${msg}`) };
    info = (msg: MessageType) => { !this.is_mute && this.logger.info(`${msg}`) };
    warn = (msg: MessageType) => { !this.is_mute && this.logger.warn(`${msg}`) };
    getLogLevel = (): LogLevel => this.logger.getLogLevel();
};

const createLogger = ((page_name: string, module_name?: string) => {
    let loggerFactory = new (class LoggerProxy {
        page_name: string;
        module_name: string;
        getLogger(page_name: string, module_name?: string) {
            if (page_name == null) {
                return factory.getLogger(`${module_name}`);
            } else {
                if (!module_name) {
                    return factory.getLogger(page_name);
                } else {
                    return factory.getLogger(`${page_name}/${module_name}`);
                }
            }
        }
    })();
    return new custom_logger(loggerFactory.getLogger(page_name, module_name));
});

export const ts_log = (function () {
  return {
    type: DepType.LIBRARY,
    name: "ts-log",
    version: "0.6.4",
    loader: (core: Core) => {
        core.log = {
            getLogger: (option: { page_name: string, module_name: string}) => {
                let { page_name, module_name } = option;
                return createLogger(page_name, module_name);
            } 
        }   
    }
  }
})();

export { createLogger };