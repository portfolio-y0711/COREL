"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DepType;
(function (DepType) {
    DepType[DepType["LIBRARY"] = 0] = "LIBRARY";
    DepType[DepType["MODULE"] = 1] = "MODULE";
})(DepType = exports.DepType || (exports.DepType = {}));
var core_1 = require("./app/core");
exports.Corel = core_1.Corel;
var core_log_ts_log_1 = require("./core-lib/core-log-ts-log");
exports.ts_log = core_log_ts_log_1.ts_log;
var core_dom_jquery_1 = require("./core-lib/core-dom-jquery");
exports.jquery_dom = core_dom_jquery_1.jquery_dom;
