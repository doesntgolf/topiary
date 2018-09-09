import * as m from "mithril";
import * as stream from "mithril/stream";
import {Stream} from "mithril/stream";

import {Tag, SavedQuery, MsgMethod, MsgObject} from "../../schema";
import {set_title} from "../../utils";
import {PermissionsNotice} from "../includes/PermissionsNotice";

export const Home: m.FactoryComponent = () => {
    let saved_queries: Array<SavedQuery> | null = null;
    let tags: Array<Tag> | null = null;

    chrome.runtime.sendMessage({
        method: MsgMethod.Read,
        object: MsgObject.SavedQueries
    }, (resp) => {
        saved_queries = resp;
        setTimeout(m.redraw);
    });

    chrome.runtime.sendMessage({
        method: MsgMethod.Read,
        object: MsgObject.Tags
    }, (resp) => {
        tags = resp;
        setTimeout(m.redraw);
    });

    set_title("topiary");

    return {
        view: () => [
            m(".home-container", [
                m(".home-saved-queries", [
                    m(".section-header", [
                        m("span.home-header", "Saved queries"),
                        m("span.view-more", [
                            " [ ",
                            m("a", {href: "/saved", oncreate: m.route.link}, "view all"),
                            " ] "
                        ])
                    ]),
                
                    saved_queries === null 
                        ? "loading..." 
                        : saved_queries.length > 0 
                            ? m("ul", saved_queries.slice(0, 6).map((save) => m("li", m("a", {
                                class: "content-link",
                                onclick: (e) => {
                                    e.redraw = false;
                                    e.preventDefault();
            
                                    m.route.set("/search", null, {state: {
                                        query: save.query,
                                        prev_page: location.pathname + "?" + m.route.get()
                                    }});
                                },
                            }, save.name))))
                            : "No saved queries"
                        ]),

                m(".home-tags", [
                    m(".section-header", [
                        m("span.home-header", "Tags"),
                        m("span.view-more", [
                            " [ ",
                            m("a", {href: "/tags", oncreate: m.route.link}, "view all"),
                            " ] "
                        ])
                    ]),
                    
                    tags === null
                        ? "loading..."
                        : tags.length > 0 ? 
                            m("ul.tag-list", tags.slice(0, 12).map((tag) => m("li", m("a.tag", {
                                class: `${tag.type}-tag`,
                                href: `/tags/${tag.text}`,
                                oncreate: m.route.link
                            }, tag.text))))
                            : "No tags found"
                ])
            ]),
            
            localStorage.getItem("notice_is_dismissed") === "true" ? null : m(PermissionsNotice),
        ]
    }
}