import { DepType, Core } from "../index"

export interface CoreDom {
  search: (selector: string) => HTMLElement,
  search_all: (selector: string) => HTMLElement[],
  make_el(tag: string, config?: {}): HTMLElement,
  tie: (listener: {
    el: HTMLElement | HTMLElement[],
    event_type: string,
    handler: Function,
    target: string | null
  }) => void,
  untie: (listener: {
    el: HTMLElement | HTMLElement[],
    event_type: string
  }) => void,
  attach_el: (el: HTMLElement, tags: string) => void,
  detach_el: (el: HTMLElement) => void
}

export const jquery_dom = (function () {
  return {
    type: DepType.LIBRARY,
    name: "jquery",
    version: "3.5.1",
    loader: (core: Core) => {
      const logger = core.log.getLogger({ page_name: "LIB", module_name: "jquery" });
      core.dom = {
        search: (selector: string) => {
          let native_dom: HTMLElement = jQuery(selector).first().get(0);
          return native_dom;
        },
        search_all: (selector: string) => {
          let native_dom: HTMLElement[] = jQuery(selector).get().map(el => el as HTMLElement);
          return native_dom;
        },
        make_el: (tag: string, config: { [name: string]: string, text?: string }) => {
          let el: HTMLElement = document.createElement(tag);
          if (config != null) {
            for (let prop in config) {
              switch (prop) {
                case "text": {
                  el.appendChild(document.createTextNode(config[prop]));
                  break;
                }
                case "id": case "class": {
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
        tie: (listener: {
          el: HTMLElement,
          event_type: string,
          handler: Function,
          target: string
        }) => {
          let { el, event_type, handler, target } = listener;
          switch (event_type) {
            case "onClick": {
              jQuery(el).on("click", (event: JQuery.ClickEvent) => {
                let data: any;
                if (target != null) {
                  data = event.currentTarget[target];
                } else {
                  data = event.currentTarget;
                }
                event.currentTarget
                handler(data);
              });
            }
          }
        },
        untie: (listener: {
          el: HTMLElement,
          event_type: string
        }) => {
          let { el, event_type } = listener;
          jQuery(el).off(event_type);
        },
        attach_el: (el: HTMLElement, tags: string) => {
          el.appendChild(document.createElement(tags));
        },
        detach_el: (el: HTMLElement) => {
          el.removeChild(el.firstChild);
        }
      }
    }
  }
})();