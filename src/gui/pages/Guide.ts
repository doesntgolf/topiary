import * as m from "mithril";
import {set_title} from "../../utils";

export const Guide: m.Component = {
    view: function(vnode) {
        set_title("topiary guide");
        return m(".column", [
            m("p", "A usage guide for Topiary is forthcoming. Stay tuned!")
        ])
    }
}