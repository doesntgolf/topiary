import * as m from "mithril";
import * as stream from "mithril/stream";
import {Stream} from "mithril/stream";

import {SavedQuery, MsgMethod, MsgObject, Result, Follow, PortMessage, PortObject} from "../../schema";
import {set_title} from "../../utils";
import {ResultFormats} from "../includes/ResultFormats";

export const Following: m.FactoryComponent = () => {
    let update_count = 1;
    
    const follows: Stream<Array<Follow>> = stream();
    follows.map((value) => {
        update_count++;
        m.redraw();
    })

    const active_index: Stream<number> = stream(-1);

    const has_access_to_alarms = stream(true);
    has_access_to_alarms.map(() => {
        setTimeout(m.redraw);
    })

    chrome.permissions.contains({
        permissions: ["alarms"]
    }, has_access_to_alarms)

    chrome.runtime.sendMessage({
        object: MsgObject.Follows,
        method: MsgMethod.Read
    }, follows);

    set_title("following");

    let tab: "results"|"settings" = "results";

    return {
        view: () => [
            m("aside.sidebar.follow-sidebar", [
                m("section", follows() ? [
                    follows().length === 0 
                        ? m("", "Not following any queries.")
                        : m("ul.feed-tabs", [
                            m("a", {
                                onclick: (e) => {
                                    active_index(-1);
                                }
                            }, m("li.feed-tab", {
                                class: active_index() === -1 ? "active" : "inactive"
                            }, m("b", "All"))),
                            
                            follows().map((follow, index) => m("a", {
                                onclick: (e) => {
                                    active_index(index);
                                }
                            }, m("li.feed-tab", {
                                class: active_index() === index ? "active" : "inactive"
                            }, follow.name)))
                        ])
                ] : "loading..."),

                !has_access_to_alarms() ? m("section", m("a.button", {
                    onclick: (e) => {
                        e.redraw = false;
                        chrome.permissions.request({
                            permissions: ["alarms"]
                        }, has_access_to_alarms)
                    }
                }, "Grant access to syndicate data in the background to enable following.")) : null,
            ]),

            follows() ? m("output", [
                m(".follow-controls.results-tabs.active", [
                    m("a.result-tab", {
                        class: tab === "results" ? "active" : "inactive",
                        onclick: (e) => {
                            tab = "results";
                        }
                    }, "Results"),

                    active_index() >= 0 ? [
                        m("a.result-tab", {
                            class: tab === "settings" ? "active" : "inactive",
                            onclick: (e) => {
                                tab = "settings";
                            }
                        }, "Settings"),

                        m("a.button", {
                            onclick: (e) => {
                                const port = chrome.runtime.connect();
                                port.onMessage.addListener((response: Array<Follow>) => {
                                    follows(response);
                                    e.target.textContent = "Refresh";
                                    port.disconnect();
                                })

                                e.target.textContent = "loading...";
                                
                                port.postMessage(<PortMessage>{
                                    object: PortObject.FollowQuery,
                                    args: follows()[ active_index() ].name
                                });
                            }
                        }, "Refresh"),
                        
                    ] : null,
                    
                    m("a.button", {
                        onclick: (e) => {
                            if (active_index() < 0) {
                                follows( follows().map(follow => {
                                    follow.unseen = [];
                                    chrome.runtime.sendMessage({
                                        object: MsgObject.Follows,
                                        method: MsgMethod.Update,
                                        args: follow
                                    });
                                    return follow;
                                }) )
                            } else {
                                let new_follow = follows()[active_index()];
                                new_follow.unseen = [];
    
                                follows()[active_index()] = new_follow;
                                follows(follows());
                                chrome.runtime.sendMessage({
                                    object: MsgObject.Follows,
                                    method: MsgMethod.Update,
                                    args: new_follow
                                });
                            }
                        }
                    }, "Dismiss all")
                ]),
                
                tab === "results"
                    ? m(ResultFormats.List, {
                        key: `follow__${active_index()}__${update_count}`,
                        results: follows().reduce((acc: Array<Result>, follow, index) => {
                            if (active_index() === -1) {
                                return acc.concat(follow.unseen);
                            } else if (active_index() === index) {
                                return acc.concat(follow.unseen);
                            } else {
                                return acc;
                            }
                        }, []).sort((a, b) => {
                            return a.mapping.date ? (b.mapping.date ? new Date(a.mapping.date.value) > new Date(b.mapping.date.value) ? -1 : 1 : -1) : b.mapping.date ? 1 : 0
                        }),
                        show_source: true
                    })
                    : m("", [
                        m("a.button", {
                            onclick: (e) => {
                                chrome.runtime.sendMessage({
                                    method: MsgMethod.Delete,
                                    object: MsgObject.Follows,
                                    args: follows()[ active_index() ]
                                }, resp => {
                                    let prev_index = active_index();
                                    active_index(-1);
                                    tab = "results";
                                    follows().splice(prev_index, 1);
                                    follows(follows());
                                })
                            }
                        }, "Unfollow"),
                        follows()[ active_index() ].last_updated ? m("", `Last updated ${new Date( follows()[ active_index() ].last_updated! ).toISOString()}`) : null,
                        m("", JSON.stringify(follows()[ active_index() ].query))
                    ])
                    
            ]) : null
        ]
    }
}