import * as m from "mithril";
import {Stream} from "mithril/stream";

import {TextParameter, NumberParameter, BooleanParameter, SimpleData, DataKind} from "../../schema";

export const QueryField: m.FactoryComponent<{
    param: TextParameter|NumberParameter|BooleanParameter,
    value: Stream<SimpleData>
}> = ({attrs}) => {
    if (attrs.param.kind === DataKind.Static && attrs.param.value !== undefined) {
        
        // actually TextData|NumberData|BooleanData; just have
        // to do this to convince tsc it's not a mapping or list
        attrs.value(<SimpleData>{
            type: attrs.param.type,
            value: attrs.param.value
        });
    }

    return {
        view: ({attrs}) => m(".queryfield", [
            attrs.param.kind === DataKind.Dynamic
                ? attrs.param.name === "phrase"
                    ? m("input.queryphrase", {
                        type: "search",
                        required: attrs.param.is_required,
                        value: attrs.value().value,
                        oninput: m.withAttr("value", current => {
                            attrs.value(<SimpleData>{
                                type: attrs.value().type,
                                value: current
                            })
                        })
                    })

                    : [
                        m("label.queryfield-label", [
                            m("span.queryfield-key", attrs.param.name),
                            m("input.queryfield-input", {
                                type: "text",
                                required: attrs.param.is_required,
                                value: attrs.value().value,
                                oninput: m.withAttr("value", current => {
                                    attrs.value(<SimpleData>{
                                        type: attrs.value().type,
                                        value: current
                                    })
                                })
                            })
                        ]),
                        attrs.param.description ? m(".parameter-description", attrs.param.description) : null
                    ]
                    : null
                    /*attrs.param.type === DataType.Mapping
                        ? Object.entries(attrs.param.mapping).map(([key, value]) => m(QueryField, {
                            param: value,
                            value: stream(value.default)
                        }))

                    : null*/
        ])
    }
}