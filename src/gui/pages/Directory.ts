import * as m from "mithril";
import * as stream from "mithril/stream";
import {Stream} from "mithril/stream";

import {Source, SavedQuery, MsgMethod, MsgObject, Message} from "../../schema";
import {set_title} from "../../utils";

import {SourceQueryForm} from "../includes/SourceQueryForm";
import {Pagination} from "../includes/Pagination";

export const Directory: m.FactoryComponent = () => {
    let sources: Array<Source>|null = null;
    chrome.runtime.sendMessage(<Message>{
        method: MsgMethod.Read,
        object: MsgObject.Sources
    }, (resp) => {
        sources = resp;
        m.redraw();
    });

    set_title("directory");

    let search_value: Stream<string> = stream("");

    let [low, high] = [0, 15];
    let page: Stream<number> = stream();
    {
        let innerpage = parseInt(m.route.param("page"));
        if (isNaN(innerpage) || innerpage < 1) innerpage = 1;
        page(innerpage);
    }
    page.map(value => {
        high = 15 * value;
        low = high - 15;

        let main: HTMLElement|null = document.querySelector("main");
        if (main && scrollY > main.offsetTop) {
            scrollTo({top: main.offsetTop, behavior: "smooth"});
        }
    })

    return {
        view: () => [
            m("aside.sidebar.column", [
                m("details[open]", [
                    m("summary", "Search directory"),
                    m("form", {
                        onsubmit: (e) => {
                            e.preventDefault();
                            chrome.runtime.sendMessage(<Message>{
                                method: MsgMethod.Read,
                                object: MsgObject.Sources,
                                args: {
                                    query: search_value()
                                }
                            }, (resp) => {
                                sources = resp;
                                page(1);
                                m.redraw();
                            });
                        }
                    }, [
                        m("input", {
                            type: "search",
                            value: search_value(),
                            oninput: m.withAttr("value", search_value)
                        }),
                        m("input.button", {
                            type: "submit",
                            value: "Search"
                        })
                    ])
                ]),

                m("section.centered", m("a.button", {
                    href: "/directory?new",
                    oncreate: m.route.link
                }, "New source"))
            ]),

            m(".column", sources !== null
                ? [
                    m("ul.directory", sources.slice(low, high).map(source => m("li.source", {
                        key: `${source.id.key}__${source.id.directory_key}`
                    }, m(SourceQueryForm, {
                        key: `${source.id.key}__${source.id.directory_key}`,
                        source: source
                    })))),

                    m(Pagination, {
                        page: page,
                        per_page: 15,
                        length: sources.length
                    })
                ] : "loading..."
            )
        ]
    }
}