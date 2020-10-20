"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sandbox_1 = require("./sandbox");
var index_1 = require("../index");
var core_log_ts_log_1 = require("../core-lib/core-log-ts-log");
var logger = core_log_ts_log_1.createLogger("CORE");
var Corel;
(function (Corel) {
    var AppManager = /** @class */ (function () {
        function AppManager(option) {
            this.option = option;
        }
        AppManager.prototype.create = function (page) {
            return Corel.create(this.option[page]);
        };
        return AppManager;
    }());
    Corel.set = function (option) { return new AppManager(option); };
    Corel.create = function (option) {
        return new (/** @class */ (function () {
            function _Core(option) {
                var _this = this;
                this.data = {};
                for (var page_name in option) {
                    var _a = option[page_name], libs = _a.libs, mods = _a.mods;
                    var libraryMap = libs.reduce(function (acc, curr) { acc.set(curr.name, curr); return acc; }, new Map());
                    var moduleMap = mods.reduce(function (acc, curr) { acc.set(curr.name, curr); return acc; }, new Map());
                    this.data[page_name] = { libraryMap: libraryMap, moduleMap: moduleMap };
                    libs.forEach(function (l) { return _this.add_dependency(page_name, l); });
                    mods.forEach(function (m) { return _this.add_dependency(page_name, m); });
                }
            }
            _Core.prototype.link = function (subscription) {
                var subscriber = subscription.subscriber, observable = subscription.observable;
                for (var page_name in this.data) {
                    var moduleMap = this.data[page_name].moduleMap;
                    moduleMap.get(subscriber).subscriptions.push(observable);
                }
            };
            _Core.prototype.push = function (eventInfo) {
                var event_name = eventInfo.event_name, data = eventInfo.data;
                // logger.trace(`(event: "${event_name}"), (data: "${data}")`);
                for (var page_name in this.data) {
                    var moduleMap = this.data[page_name].moduleMap;
                    moduleMap.forEach(function (module) {
                        module.subscriptions.filter(function (o) { return o.name === event_name; }).forEach(function (o) { return o.handler(data); });
                    });
                }
            };
            _Core.prototype.start = function (moduleID, page_name) {
                var mod;
                if (!page_name) {
                    for (var page_name in this.data) {
                        mod = this.data[page_name].moduleMap.get(moduleID);
                    }
                }
                else {
                    mod = this.data[page_name].moduleMap.get(moduleID);
                    mod.subscriptions = [];
                }
                var instance = mod.instance, loader = mod.loader;
                var module_body = instance = loader(sandbox_1.Sandbox(this, moduleID, page_name));
                module_body.dock();
            };
            _Core.prototype.start_all = function () {
                var _this = this;
                for (var page_name in this.data) {
                    this.data[page_name].moduleMap.forEach(function (module, module_name) {
                        _this.start(module_name, page_name);
                    });
                }
            };
            _Core.prototype.add_dependency = function (page_name, deps) {
                var _this = this;
                switch (deps.type) {
                    case index_1.DepType.LIBRARY: {
                        var libraryMap = this.data[page_name].libraryMap;
                        var name_1 = deps.name, version = deps.version;
                        libraryMap.set(name_1, deps);
                        libraryMap.forEach(function (l) { return l.loader(_this); });
                        break;
                    }
                    case index_1.DepType.MODULE: {
                        var moduleMap = this.data[page_name].moduleMap;
                        var name_2 = deps.name;
                        moduleMap.set(name_2, deps);
                        break;
                    }
                }
            };
            return _Core;
        }()))(option);
    };
})(Corel = exports.Corel || (exports.Corel = {}));
