import * as m from "mithril";
import * as stream from "mithril/stream";
import {Stream} from "mithril/stream";

import {Source} from "../../schema";
import {QueryForm} from "../includes/QueryForm";
import {query_input_parameters} from "../../utils";

export const SourceQueryForm: m.FactoryComponent<{
    source: Source
}> = ({attrs}) => {

    return {
        view: ({attrs}) => m(".source-query-form", [
            m("h2.source-name", attrs.source.name),

            m(".edit-link", [
                "[ ",
                m("a", {
                    href: `/directory/${attrs.source.id.directory_key}/${attrs.source.id.key}?edit`,
                    oncreate: m.route.link
                }, "edit"),
                " ]"
            ]),

            attrs.source.homepage ? m("", m("a.result-url", {
                href: attrs.source.homepage,
                rel: "external"
            }, attrs.source.homepage)) : null,

            attrs.source.tags.length > 0 ? m("ul.tag-list", attrs.source.tags.map(tag => m("li", m("a.tag", {
                href: `/tags/${tag.text}`,
                oncreate: m.route.link
            }, tag.text)))) : null,

            attrs.source.description ? m(".source-description", attrs.source.description) : null,

            attrs.source.forward_to
                ? m(QueryForm, {
                    submit_text: "Go",
                    template: {
                        inputs: query_input_parameters(attrs.source.forward_to).map(param => ({
                            param: param,
                            source_mapping: []
                        })),
                        options: {
                            redirect: attrs.source.id
                        }
                    },
                    legend: "Forwarding"
                })
                : null,
            
            attrs.source.syndicate_from
                ? [
                    /*has_access || ? null : m("a", {
                        onclick: (e) => {
                            e.redraw = false;
                            chrome.permissions.request({
                                origins: [(attrs.source.syndicate_from!.api as API).endpoint.root]
                            }, (granted) => {
                                if (granted) {
                                    has_access = true;
                                    m.redraw();
                                }
                            })
                        }
                    }, "Grant access to request data from this source."),*/

                    m(QueryForm, {
                        submit_text: query_input_parameters(attrs.source.syndicate_from.api.input).length === 0 ? "View" : "Search",
                        template: {
                            inputs: query_input_parameters(attrs.source.syndicate_from.api.input).map(param => ({
                                param: param,
                                source_mapping: []
                            })),
                            options: {
                                include_ids: [attrs.source.id]
                            }
                        },
                        legend: "Syndicating"
                    })
                ] : null
        ])
    }
}