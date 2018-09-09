import * as m from "mithril";

import {API} from "../../schema";
import {set_title} from "../../utils";

export const Playground: m.Component<{key?: string}, API> = {
    /*oninit: function(vnode) {
        if (vnode.attrs.key) {
            let source = [].find(function(source) {
                return source === vnode.attrs.key;
            })

            if (source) {

            }
        } else {
            vnode.state = {
                type: "api",
                method: Method.GET,
                endpoint: {
                    root: ""
                }
            }
        }
    },*/
    view: function(vnode) {
        set_title("Playground");
        return [
            //m("aside.sidebar"),

            m("", [
                m("p", "Coming soon...")
            ])
            
        ];
    }
}