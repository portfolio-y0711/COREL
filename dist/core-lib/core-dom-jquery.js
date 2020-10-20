"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
exports.jquery_dom = (function () {
    return {
        type: index_1.DepType.LIBRARY,
        name: "jquery",
        version: "3.5.1",
        loader: function (core) {
            var logger = core.log.getLogger({ page_name: "LIB", module_name: "jquery" });
            core.dom = {
                search: function (selector) {
                    var native_dom = jQuery(selector).first().get(0);
                    return native_dom;
                },
                search_all: function (selector) {
                    var native_dom = jQuery(selector).get().map(function (el) { return el; });
                    return native_dom;
                },
                make_el: function (tag, config) {
                    var el = document.createElement(tag);
                    if (config != null) {
                        for (var prop in config) {
                            switch (prop) {
                                case "text": {
                                    el.appendChild(document.createTextNode(config[prop]));
                                    break;
                                }
                                case "id":
                                case "class": {
                                    jQuery(el).attr(prop, config[prop]).first().get(0);
                                }
                                default: {
                                    break;
                                }
                            }
                        }
                    }
                    return el;
                },
                tie: function (listener) {
                    var el = listener.el, event_type = listener.event_type, handler = listener.handler, target = listener.target;
                    switch (event_type) {
                        case "onClick": {
                            jQuery(el).on("click", function (event) {
                                var data;
                                if (target != null) {
                                    data = event.currentTarget[target];
                                }
                                else {
                                    data = event.currentTarget;
                                }
                                event.currentTarget;
                                handler(data);
                            });
                        }
                    }
                },
                untie: function (listener) {
                    var el = listener.el, event_type = listener.event_type;
                    jQuery(el).off(event_type);
                },
                attach_el: function (el, tags) {
                    el.appendChild(document.createElement(tags));
                },
                detach_el: function (el) {
                    el.removeChild(el.firstChild);
                }
            };
        }
    };
})();
