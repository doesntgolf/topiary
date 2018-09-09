import * as m from "mithril";
import * as stream from "mithril/stream";
import {Stream} from "mithril/stream";

import {Source, QueryTemplate, Query} from "../../schema";
import {FieldSet} from "./FieldSet";
import {QueryField} from "./QueryField";

export const QueryForm: m.FactoryComponent<{
    template: QueryTemplate,
    submit_text: string,
    legend?: string,
}> = ({attrs}) => {
    const new_query: Query = {fields: {}, source_specific: [], options: attrs.template.options, pipeline: []};

    return {
        view: ({attrs}) => m("form.queryform", {
            onsubmit: (e) => {
                e.redraw = false;
                e.preventDefault();

                m.route.set(
                    "/search",
                    null,
                    {
                        state: {
                            key: Date.now(),
                            query: new_query
                        }
                    }
                )
            }
        }, m(FieldSet, {legend: attrs.legend}, [
            attrs.template.inputs.sort(
                // Sort the phrase parameter to the top.
                (a, b) => b.param.name === "phrase" ? 1 : (a.param.name === "phrase" ? -1 : 0)
            ).map(input => {
                const value = stream(new_query.fields[input.param.name] || {
                    type: input.param.type,
                    value: input.param.value || ""
                });
                value.map(current => {
                    new_query.fields[input.param.name] = current;

                    if (input.source_mapping) {
                        input.source_mapping.forEach(item => {
                            let match = new_query.source_specific.find(qitem => {
                                return item.source.key === qitem.source.key && item.source.directory_key === qitem.source.directory_key;
                            })

                            if (match !== undefined) {
                                match.fields[item.field_name] = current;
                            } else {
                                let fields = {};
                                fields[item.field_name] = current;

                                new_query.source_specific.push({
                                    source: item.source,
                                    fields: fields
                                })
                            }
                        })
                    }
                });

                return m(QueryField, {param: input.param, value: value});
            }),

            m(".submit", m("input", {
                type: "submit",
                value: attrs.submit_text
            }))
        ]))
    }
}