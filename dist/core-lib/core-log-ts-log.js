"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_logging_1 = require("typescript-logging");
var index_1 = require("../index");
var options = new typescript_logging_1.LoggerFactoryOptions()
    .addLogGroupRule(new typescript_logging_1.LogGroupRule(new RegExp("Dev/+"), typescript_logging_1.LogLevel.Trace))
    .addLogGroupRule(new typescript_logging_1.LogGroupRule(new RegExp("err/+"), typescript_logging_1.LogLevel.Trace))
    .addLogGroupRule(new typescript_logging_1.LogGroupRule(new RegExp(".+"), typescript_logging_1.LogLevel.Trace));
exports.factory = typescript_logging_1.LFService.createNamedLoggerFactory("LoggerFactory", options);
var custom_logger = /** @class */ (function () {
    function class_1(logger) {
        var _this = this;
        this.is_mute = false;
        this.trace = function (msg) { !_this.is_mute && _this.logger.trace("" + msg); };
        this.info = function (msg) { !_this.is_mute && _this.logger.info("" + msg); };
        this.warn = function (msg) { !_this.is_mute && _this.logger.warn("" + msg); };
        this.getLogLevel = function () { return _this.logger.getLogLevel(); };
        this.logger = logger;
        this.name = logger.name;
    }
    class_1.prototype.mute = function () { this.is_mute = true; };
    class_1.prototype.unmute = function () { this.is_mute = false; };
    class_1.prototype.debug = function (msg) { !this.is_mute && this.logger.debug("" + msg); };
    ;
    return class_1;
}());
var createLogger = (function (page_name, module_name) {
    var loggerFactory = new (/** @class */ (function () {
        function LoggerProxy() {
        }
        LoggerProxy.prototype.getLogger = function (page_name, module_name) {
            if (page_name == null) {
                return exports.factory.getLogger("" + module_name);
            }
            else {
                if (!module_name) {
                    return exports.factory.getLogger(page_name);
                }
                else {
                    return exports.factory.getLogger(page_name + "/" + module_name);
                }
            }
        };
        return LoggerProxy;
    }()))();
    return new custom_logger(loggerFactory.getLogger(page_name, module_name));
});
exports.createLogger = createLogger;
exports.ts_log = (function () {
    return {
        type: index_1.DepType.LIBRARY,
        name: "ts-log",
        version: "0.6.4",
        loader: function (core) {
            core.log = {
                getLogger: function (option) {
                    var page_name = option.page_name, module_name = option.module_name;
                    return createLogger(page_name, module_name);
                }
            };
        }
    };
})();
