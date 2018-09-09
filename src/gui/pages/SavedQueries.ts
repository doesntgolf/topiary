import * as m from "mithril";
import * as stream from "mithril/stream";
import {Stream} from "mithril/stream";

import {SavedQuery, MsgMethod, MsgObject} from "../../schema";
import {set_title} from "../../utils";

export const SavedQueries: m.FactoryComponent = () => {
    set_title("saved queries");

    let saved_queries: Array<SavedQuery> | null = null;

    chrome.runtime.sendMessage({
        method: MsgMethod.Read,
        object: MsgObject.SavedQueries
    }, (resp) => {
        saved_queries = resp;
        m.redraw();
    });
    
    return {
        view: (vnode) => [
            m("aside.sidebar.column"),
            m(".column", [
                saved_queries === null
                    ? "loading..."
                    : [
                        m("p", `${saved_queries.length} saved quer${saved_queries.length === 1 ? "y" : "ies"}.`),
                
                        m("ul", saved_queries.map((saved_query) => m("li", m("a", {
                            onclick: (e) => {
                                e.redraw = false;
                                e.preventDefault();
                                m.route.set("/search", null, {
                                    state: {
                                        key: Date.now(),
                                        query: saved_query.query
                                    }
                                })
                            }
                        }, saved_query.name)))),
                    ],
                
                m("p", "Save searches by clicking the ", m("mark", "Save this search"), " button on the search results page.")
            ])
        ]
    }
}