import * as m from "mithril";
import * as stream from "mithril/stream";
import {Stream} from "mithril/stream";

import {Tag, MsgMethod, MsgObject} from "../../schema";
import {set_title} from "../../utils";

export const TagIndex: m.FactoryComponent<{type?: string}> = ({attrs}) => {
    set_title(`${attrs.type === undefined ? "all" : attrs.type} tags`);

    let tags: Array<Tag>|null = null;

    chrome.runtime.sendMessage({
        method: MsgMethod.Read,
        object: MsgObject.Tags
    }, (resp) => {
        if (attrs.type !== undefined) {
            resp = resp.filter((tag: Tag) => tag.type === attrs.type);
        }
        
        tags = resp;
        setTimeout(m.redraw);
    });

    let search_value: Stream<string> = stream("");

    return {
        view: () => {
            return [
                m("aside.sidebar", [
                    m("details[open]", [
                        m("summary", "Search tags"),
                        m("form", {
                            onsubmit: (e) => {
                                console.log("searching for ", search_value())
                                e.preventDefault();
                                chrome.runtime.sendMessage({
                                    method: MsgMethod.Read,
                                    object: MsgObject.Tags,
                                    args: {
                                        query: search_value()
                                    }
                                }, (resp) => {
                                    if (attrs.type !== undefined) {
                                        resp = resp.filter((tag: Tag) => tag.type === attrs.type);
                                    }
                                    console.log(resp);
                                    
                                    tags = resp;
                                    setTimeout(m.redraw);
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
                    ])
                ]),

                m("", [
                    tags === null ? "loading..." : m("ul.tag-list", tags.map((tag) => m("a.tag", {
                        class: `${tag.type}-tag`,
                        href: `/tags/${tag.text}`,
                        oncreate: m.route.link
                    }, tag.text)))
                ])
            ]
        }
    }
}