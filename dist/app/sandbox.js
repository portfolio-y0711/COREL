"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sandbox = function (core, moduleID, page_name) {
    return new (/** @class */ (function () {
        function _Sandbox(core, module_name, page_name) {
            var logger = this.logger = core.log.getLogger({ page_name: page_name, module_name: module_name });
            this.moduleID = moduleID;
            this.container = core.dom.search('#' + moduleID);
            this.core = core;
        }
        _Sandbox.prototype.create_el = function (tag, config) {
            var el = document.createElement(tag);
            return this.core.dom.make_el(tag, config);
        };
        _Sandbox.prototype.subscribe = function (observables) {
            var _this = this;
            observables.forEach(function (o) {
                _this.core.link({ subscriber: moduleID, observable: o });
            });
        };
        _Sandbox.prototype.publish = function (eventInfo) {
            this.core.push(eventInfo);
        };
        _Sandbox.prototype.add_trigger = function (listener) {
            this.core.dom.tie(listener);
        };
        _Sandbox.prototype.remove_trigger = function (listener) {
            this.core.dom.untie(listener);
        };
        _Sandbox.prototype.getLogger = function () {
            return this.logger;
        };
        _Sandbox.prototype.find = function (selector) {
            return core.dom.search(selector);
        };
        _Sandbox.prototype.find_all = function (selector) {
            return core.dom.search_all(selector);
        };
        return _Sandbox;
    }()))(core, moduleID, page_name);
};
