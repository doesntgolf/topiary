import * as m from "mithril";
import * as stream from "mithril/stream";
import {Stream} from "mithril/stream";

import {Tag, MsgMethod, MsgObject, Source, Message, DataKind, DataType} from "../../schema";
import {set_title} from "../../utils";

import {QueryForm} from "../includes/QueryForm";

export const TagDetail: m.FactoryComponent<{text: string}> = ({attrs}) => {
    set_title(`"${attrs.text}" tag`);

    let sources: Array<Source>|null = null;
    chrome.runtime.sendMessage(<Message>{
        method: MsgMethod.Read,
        object: MsgObject.Sources
    }, (resp) => {
        sources = resp.filter((source: Source) => {
            return source.tags.some((tag: Tag) => tag.text === attrs.text);
        });
        setTimeout(m.redraw);
    });

    return {
        view: ({attrs}) => [
            m("", {style: "margin: 0 auto;"}, [
                m("h1.source-name", `"${attrs.text}" tag`),

                m(".edit-link", [
                    "[ ",
                    m("a", {
                        href: `/tags/${attrs.text}?edit`,
                        oncreate: m.route.link
                    }, "edit"),
                    " ]"
                ]),

                m(QueryForm, {
                    template: {
                        inputs: [{
                            param: {
                                kind: DataKind.Dynamic,
                                type: DataType.Text,
                                name: "phrase",
                                is_required: true
                            },
                            source_mapping: []
                        }],
                        options: {
                            include_tags: [attrs.text]
                        }
                    },
                    submit_text: "Search"
                }),

                sources === null ? "loading..." : [
                    m("p", `${sources.length} source${sources.length !== 1 ? "s" : ""} with this tag:`),

                    m("", sources.map((source, index) => [
                        index !== 0 ? ", " : null,
                        m("a", {
                            href: `/directory/${source.id.directory_key}/${source.id.key}`,
                            oncreate: m.route.link
                        }, source.name)
                    ]))
                ]
            ])
        ]
    }
}
