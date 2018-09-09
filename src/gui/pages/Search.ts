import * as m from "mithril";
import * as stream from "mithril/stream";
import {Stream} from "mithril/stream";

import {Query, Face, Status, Results, Message, MsgMethod, MsgObject, Follow, SavedQuery, PortMessage, PortObject, SourceID} from "../../schema";
import {set_title} from "../../utils";

import {ResultFormats} from "../includes/ResultFormats";

export const Search: m.FactoryComponent<{
    query: Stream<Query>,
    face: Stream<Face>,
    in_popup: boolean,
    popup_forwards: string
}> = ({attrs}) => {

    const active_sources: Stream<Array<SourceID>> = stream([]);
    
    const search_results: Stream<Results> = stream();
    search_results.map((results: Results) => {
        console.log(results)
        if (results.redirect) {
            if (attrs.in_popup && attrs.popup_forwards === "new_tab") {
                chrome.tabs.create({url: results.redirect!.url});
            } else {
                // Make redirect back button friendly; go back to main page with previous query filled out, so that the redirect isn't re-triggered.
                if (!attrs.in_popup) {
                    history.replaceState(Object.assign({}, history.state, {prev_page: null}), "", history.state.prev_page);
                }
                chrome.tabs.update({url: results.redirect!.url});
            }
        }
        active_sources(results.details
            .filter(item => item.is_completed && item.is_success)
            .map(value => value.source.id)
        )
        m.redraw();
    })

    const sort_by: Stream<string> = stream("score");

    const port = chrome.runtime.connect();
    port.onMessage.addListener((response: Results) => {
        search_results(response);
    })

    attrs.query.map(value => {
        port.postMessage(<PortMessage>{
            object: PortObject.Query,
            args: value
        });
    })
    
    set_title("search");

    return {
        onremove: () => {
            port.disconnect()
        },
        view: () => search_results() === undefined ? "loading..." : [
            m("aside.sidebar", [
                m(AdvancedQuery, {sort_by: sort_by}),

                search_results().details.length > 0 ? [
                    m("details", {
                        // Should only start as closed if single column and results are loaded.
                        open: !search_results() || innerWidth > 800
                    }, [
                        m("summary", `Queried ${search_results().details.length} source${search_results().details.length === 1 ? "" : "s"}`),
                        m("ul", search_results().details.map((status: Status) => m("li", [
                            m("label", [
                                m("b", {
                                    class: (status.is_completed ? (status.is_success ? "success" : "fail") : "loading")
                                }, status.source.name),
                                
                                search_results().details.length > 1 && status.is_completed && status.is_success ? m("input", {
                                    type: "checkbox",
                                    checked: active_sources().some(item => item.key === status.source.id.key && item.directory_key === status.source.id.directory_key),
                                    oninput: m.withAttr("checked", checked => {
                                        if (checked) {
                                            // Add source
                                            active_sources(
                                                active_sources().concat(status.source.id)
                                            )
                                        } else {
                                            // Remove source
                                            let index = active_sources()
                                                .findIndex(item => {
                                                    return item.key === status.source.id.key
                                                    && item.directory_key === status.source.id.directory_key;
                                                });
                                            if (index >= 0) {
                                                active_sources(
                                                    active_sources().filter((_, i) => index !== i)
                                                )
                                            }
                                        }
                                    })
                                }) : null
                            ])
                        ])))
                    ])
                ] : null,

                search_results().list.length > 0
                    ? [
                        m("section", [
                            m("", {style: "margin-bottom: 10px;"}, "View results as..."), // @TODO
                            m("", ["List", "Table"/*, "Grid", "Bar graph"*/].map((type: "List"|"Grid"|"Table") => m("a.button", {
                                onclick: (e) => {
                                    attrs.face(type);
                                },
                                class: type === attrs.face() ? "selected" : "unselected"
                            }, type)))
                        ]),

                        m("section", [
                            m("a.button", {
                                onclick: (e) => {
                                    e.redraw = false;
                                    print();
                                }
                            }, "Print"),

                            m("", {style: "margin-top: 10px;"}, "Export results as..."),
                            m("", ["JSON", "CSV", "XML", "HTML"].map((format, index) => [
                                index !== 0 ? ", " : null,
                                m("a", {
                                    onclick: (e) => {
                                        e.redraw = false;
                                        let element = document.createElement("a");
                                        element.setAttribute("download", `search_results.${format.toLowerCase()}`);

                                        if (format === "JSON") {
                                            element.setAttribute("href", `data:application/json;charset=utf-8,${JSON.stringify(search_results().list)}`);
                                        } else if (format === "XML") {
                                            let xml = document.querySelector(".result-list");
                                            if (xml !== null) {
                                                let content = new XMLSerializer().serializeToString(xml);
                                                element.setAttribute("href", `data:text/xml;charset=utf-8,${content}`);
                                            }
                                        } else {
                                            let html = document.querySelector(".result-list");
                                            if (html !== null) {
                                                let content = new XMLSerializer().serializeToString(html);
                                                element.setAttribute("href", `data:text/html;charset=utf-8,${content}`);
                                            }
                                        }
                                        element.click();
                                    }
                                }, format)
                            ]))
                        ]),
        
                        m("section", [
                            m("a.button", {
                                onclick: (e) => {
                                    chrome.runtime.sendMessage(<Message>{
                                        method: MsgMethod.Create,
                                        object: MsgObject.SavedQueries,
                                        args: <SavedQuery>{
                                            name: String( attrs.query().fields.phrase ? attrs.query().fields.phrase.value : Date.now() ),
                                            query: attrs.query(),
                                            face: attrs.face()
                                        }
                                    }, console.log)
                                }
                            }, "Save query"),
                            m("a.button", {
                                onclick: (e) => {
                                    chrome.runtime.sendMessage(<Message>{
                                        method: MsgMethod.Create,
                                        object: MsgObject.Follows,
                                        args: <Follow>{
                                            name: String( attrs.query().fields.phrase ? attrs.query().fields.phrase.value : Date.now() ),
                                            query: attrs.query(),
                                            face: attrs.face(),
                                            request_interval: 10,
                                            unseen: [],
                                            seen: []
                                        }
                                    }, console.log)
                                }
                            }, "Follow search")
                        ])
                    ]
                    : null
            ]),

            m("output", {form: "query"}, !search_results().is_completed
                ? search_results().details.length > 0 ? m("progress", {
                    value: search_results().details.filter((status: Status): boolean => {
                        return status.is_completed;
                    }).length / search_results().details.length
                }) : null

                : (search_results().redirect
                    ? m("", {title: search_results().redirect!.url}, "Forwarding to ", m("b", search_results().redirect!.to.name), " ...")

                    : [
                        m(ResultFormats[attrs.face()], {
                            results: search_results().list.filter(result => {
                                return result.source && active_sources().some(item => item.key === result.source!.id.key && item.directory_key === result.source!.id.directory_key);
                            }).sort((a, b) => {
                                if (sort_by() === "score") {
                                    return (b.mapping.score ? (a.mapping.score ? (b.mapping.score.value > a.mapping.score.value ? 1 : -1) : 1) : -1);
                                } else {
                                    return a.mapping.date ? (b.mapping.date ? new Date(a.mapping.date!.value) > new Date(b.mapping.date!.value) ? -1 : 1 : -1) : b.mapping.date ? 1 : 0
                                }
                            }),
                            key: "search_results",
                            show_source: search_results().details.length > 1
                        }),

                        search_results().elsewhere && search_results().elsewhere!.length > 0
                            ? m(".elsewhere", {key: "elsewhere"}, "Try your search at: ", search_results().elsewhere!.map((place, index, list) => [
                                index > 0 ? ", " : null,
                                m("a", {
                                    href: place.url,
                                    rel: "external"
                                }, place.source.name),
                                index + 1 === list.length ? "." : null
                            ]))
                            : null
                    ]
                )
            )
        ]
    }
};


const AdvancedQuery: m.FactoryComponent<{/*query: Stream<Query>*/ sort_by: Stream<string>}> = () => ({
    view: ({attrs}) => m("details.advanced-search[open]", [
        m("summary", "Advanced search"),
        /*attrs.query().pipeline ? attrs.query().pipeline!.map(transform => {
            m("", "a transform")
        }) : null,
        "Add transform"*/

        m("", "sort by:"),
        m("label", m("input", {
            type: "radio",
            name: "sort_by",
            value: "score",
            checked: attrs.sort_by() === "score",
            oninput: () => attrs.sort_by("score")
        }), "score"),
        m("label", m("input", {
            type: "radio", 
            name: "sort_by",
            value: "date",
            checked: attrs.sort_by() !== "score",
            oninput: () => attrs.sort_by("date")
        }), "date")
    ])
})