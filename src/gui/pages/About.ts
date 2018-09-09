import * as m from "mithril";
import {set_title} from "../../utils";

export const About: m.Component = {
    view: function(vnode) {
        set_title("about topiary");
        return m(".column", [
            m("p", "Topiary is a search engine directory and API client. Its purpose is to help users quickly find information from sources that they trust. It is in active development, and is still in an alpha state. Topiary is licensed under the terms of the GNU General Public License version 3.")
        ])
    }
}