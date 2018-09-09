import * as m from "mithril";
import * as stream from "mithril/stream";
import {Stream} from "mithril/stream";

import {set_title} from "../../utils";

export const Stats: m.Component = {
    view: function() {
        set_title("statistics");
        return [
            //m("aside.sidebar"),
            m("", [
                m("ul", [].map((err) => m("li", err)))
            ])
        ]
    }
}