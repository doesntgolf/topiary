import * as m from "mithril";
import * as stream from "mithril/stream";
import {Stream} from "mithril/stream";

import {Source, SavedQuery, MsgMethod, MsgObject, DataType, DataKind, Format, SimpleParameter, Parameter, TextParser, Parser} from "../../schema";
import {set_title, is_simple_parameter, is_simple_parser} from "../../utils";

export const SourceEditor: m.FactoryComponent<{key?: string}> = ({attrs}) => {
    let source: Source|null|undefined = null;
    const is_new = attrs.key === undefined;

    if (is_new) {
        source = {
            id: {key: String(Date.now()), directory_key: "local"},
            name: "",
            subscribed: true,
            is_active: true,
            keys: [],
            tags: [],
            related_sources: []
        }
    } else {
        chrome.runtime.sendMessage({
            object: MsgObject.Sources,
            method: MsgMethod.Read
        }, (resp: Array<Source>) => {
            source = resp.find(item => item.id.key === attrs.key);
            m.redraw();
        })
    }

    set_title("source editor");
    
    return {
        view: () => source === null
            ? "...loading"
            : source === undefined
                ? "Unable to find source."
                : m("table", m("form", {
                    onsubmit: (e) => {
                        e.redraw = false;
                        e.preventDefault();
                        chrome.runtime.sendMessage({
                            object: MsgObject.Sources,
                            method: is_new ? MsgMethod.Create : MsgMethod.Update,
                            arg: source
                        }, (resp) => {
                            if (!resp) alert("Sorry, failed to save.");
                        })
                    }
                }, [
                    m("tr.field", m("label", [
                        m("td.field-label", "Name"),
                        m("td", m("input", {
                            type: "text",
                            value: source.name,
                            oninput: m.withAttr("value", (value => source!.name = value))
                        }))
                    ])),
                    
                    m("tr.field", m("label", [
                        m("td.field-label", "Description"),
                        m("td", m("textarea", {
                            oninput: m.withAttr("value", value => source!.description = value)
                        }, source.description || ""))
                    ])),

                    m("tr.field", m("label", [
                        m("td.field-label", "Homepage"),
                        m("td", m("input", {
                            type: "url",
                            value: source.homepage,
                            oninput: m.withAttr("value", value => source!.homepage = value)
                        }))
                    ])),
                    
                    m("tr.field", m("label", [
                        m("td.field-label", "Keys"),
                        m("td", m("input", {
                            type: "text",
                            value: source.keys.join(", "),
                            oninput: m.withAttr("value", (value => {
                                source!.keys = value.split(",").map(item => item.trim());
                            }))
                        }))
                    ])),
                    
                    m("tr.field", m("label", [
                        m("td.field-label", "Tags"),
                        m("td", m("input", {
                            type: "text",
                            value: source.tags.join(", "),
                            oninput: m.withAttr("value", (value => {
                                source!.tags = value.split(",").map(item => item.trim());
                            }))
                        }))
                    ])),

                    source.forward_to ? [
                        m("tr", m("td", {colspan: 2}, m("h2", "Forwarding"))),

                        m("tr.field", m("label", [
                            m("td.field-label", "Root URL"),
                            m("td", m("input", {
                                type: "url",
                                value: source.forward_to.mapping.root.value,
                                oninput: m.withAttr("value", value => source!.forward_to!.mapping.root.value = value)
                            }))
                        ])),

                        source.forward_to.mapping.querystring
                            ? [
                                m("tr", m("td", {colspan: 2}, m("h3", "Querystring parameters"))),
                                
                                Object.keys(source.forward_to.mapping.querystring).map(key => m("tr", [
                                    m("td", m("input", {type: "text", value: key})),
                                    m("td", m(ParamEditor, {param: stream(source!.forward_to!.mapping.querystring![key])}))
                                ]))
                            ] : null,
                        m("tr", m("td", {colspan: 2}, m("a", {
                            onclick: (e) => {
                                source!.forward_to!.mapping.querystring = source!.forward_to!.mapping.querystring || {
                                    name: "Query parameters",
                                    type: DataType.Mapping,
                                    mapping: {}
                                };
                                source!.forward_to!.mapping.querystring![String(Date.now())] = {
                                    kind: DataKind.Dynamic,
                                    type: DataType.Text,
                                    name: "",
                                    is_required: false
                                };
                            }
                        }, "Add querystring parameter"))),

                        source.forward_to.mapping.hash
                            ? m(ParamEditor, {param: stream(source.forward_to.mapping.hash)})
                            : m("a", {
                                onclick: (e) => {
                                    source!.forward_to!.mapping.hash = {
                                        kind: DataKind.Dynamic,
                                        type: DataType.Text,
                                        name: "",
                                        is_required: false
                                    }
                                }
                            }, "Add hash")

                    ] : m("a", {
                        onclick: (e) => {
                            source!.forward_to = {
                                type: DataType.Mapping,
                                mapping: {
                                    "root": {
                                        name: "",
                                        is_required: true,
                                        kind: DataKind.Static,
                                        type: DataType.Text
                                    }
                                }
                            }
                        }
                    }, "Add forwarding"),

                    source.syndicate_from ? [
                        m("tr.field", m("label", [
                            m("td.field-label", "Usage policy"),
                            m("td", m("textarea", {
                                oninput: m.withAttr("value", value => source!.syndicate_from!.usage_policy = value)
                            }, source.syndicate_from.usage_policy || ""))
                        ])),

                        source.syndicate_from.triggers.map(trigger => [
                            m("input", {type: "text", value: trigger.term}),
                            m("select", {id: trigger.type}, ["regex", "starts", "contains", "ends"].map(
                                item => m("option", {value: item}, item))
                            ),
                            m("input", {type: "checkbox", checked: trigger.case_sensitive}),
                            m("input", {type: "text", value: trigger.map_to_parameter_of_key || ""}),
                            m("input", {type: "text", value: trigger.substitute_with || ""}),
                            m("input", {type: "checkbox", checked: trigger.remove_from_phrase}),
                        ]),

                        m("input", {type: "radio", name: "format", checked: source.syndicate_from.format === Format.JSON}),
                        m("input", {type: "radio", name: "format", checked: source.syndicate_from.format === Format.XML}),

                        ["title", "score", "description", "date", "link", "image_url", "audio_url", "video_url", "iframe_url", "html", "license", "identifier"].map(field_key => {
                            if (source!.syndicate_from!.parser[field_key]) {
                                return m(ParserEditor, {parser: stream(source!.syndicate_from!.parser[field_key]!)});
                            }
                            return `Add ${field_key} field`;
                        }),

                    ] : "Add syndicating",

                    m("input.button", {
                        type: "submit",
                        value: is_new ? "Create" : "Update"
                    })
                ]))
    }
}



const ParamEditor: m.FactoryComponent<{
    param: Stream<Parameter>
}> = () => ({
    view: ({attrs}) => is_simple_parameter(attrs.param()) ? [
        m(".field", m("label", [
            m("span.field-label", "Name"),
            m("input", {
                type: "text",
                value: (<SimpleParameter>attrs.param()).name,
                oninput: m.withAttr("value", (value) => {
                    attrs.param(Object.assign(attrs.param(), {name: value}));
                })
            })
        ])),

        m(".field", m("label", [
            m("span.field-label", "Description"),
            m("textarea", {
                value: (<SimpleParameter>attrs.param()).description || "",
                oninput: m.withAttr("value", (value) => attrs.param(
                    Object.assign(attrs.param(), {description: value})
                ))
            }, (<SimpleParameter>attrs.param()).description || "")
        ])),

        (<SimpleParameter>attrs.param()).value
            ? m(".field", m("label", [
                m("span.field-label", "Default value"),
                m("input", {
                    type: "text",
                    value: (<SimpleParameter>attrs.param()).value,
                    oninput: m.withAttr("value", (value) => attrs.param(
                        Object.assign(attrs.param(), {value: (<SimpleParameter>attrs.param()).value})
                    ))
                })
            ]))
            : m("a", {
                onclick: (e) => {
                    attrs.param(
                        Object.assign(attrs.param(), {value: ""})
                    )
                }
            }, "Add default value"),

        m(".field", m("label", [
            m("span.field-label", "Value is fixed"),
            m("input", {
                type: "checkbox",
                checked: (<SimpleParameter>attrs.param()).kind === DataKind.Static,
                oninput: m.withAttr("checked", (checked) => attrs.param(
                    Object.assign(attrs.param(), {kind: checked ? DataKind.Static : DataKind.Dynamic})
                ))
            })
        ])),
        
        m(".field", m("label", [
            m("span.field-label", "Parameter is required"),
            m("input", {
                type: "checkbox",
                checked: (<SimpleParameter>attrs.param()).is_required,
                oninput: m.withAttr("checked", (value) => attrs.param(
                    Object.assign(attrs.param(), {is_required: value})
                ))
            })
        ])),

        (<SimpleParameter>attrs.param()).options
            ? [
                m("h5", "Options are not yet editable :/"),
                /*(<SimpleParameter>attrs.param()).options!.map(({label, value}) => {
                    return m(".field", m("label", [
                        m("span.field-label", "Parameter options"),
                        m("input", {
                            type: "text",
                            value: option.value,
                            oninput: m.withAttr("value", (value) => attrs.param(
                                Object.assign(attrs.param(), {options: value.split(",").map(item => item.trim())})
                            ))
                        })
                    ]))
                })*/
                
            ] : m("a", {
                onclick: (e) => {
                    attrs.param(
                        Object.assign(attrs.param(), {options: []})
                    )
                }
            }, "Add options"),
            
    ] : [
        m("", "Compound parameter editor!")
    ]
})



const ParserEditor: m.FactoryComponent<{
    parser: Stream<Parser>
}> = ({attrs}) => {

    return {
        view: () => is_simple_parser(attrs.parser())
            ? [
                m(".field", m("label", [
                    m("span.field-label", "Expression"),
                    m("input.parser", {
                        type: "text",
                        value: (<TextParser>attrs.parser()).expression,
                        oninput: m.withAttr("value", (value) => attrs.parser(
                            Object.assign(attrs.parser(), {expression: value})
                        ))
                    })
                ])),

                /*attrs.parser().default
                    ? m(".field", m("label", [
                        m("span.field-label", "Default value"),
                        m("input", {
                            type: "text",
                            value: attrs.parser().default!.value,
                            oninput: m.withAttr("value", (value) => attrs.parser(
                                Object.assign(attrs.parser(), {default: {type: attrs.parser().default!.type, value: value}})
                            ))
                        })
                    ]))
                    : "Add default value",*/

                attrs.parser().type === DataType.Text
                    ? [
                        m("h3", "Match markers"),
                        m(".field", m("label", [
                            m("span.field-label", "Start"),
                            m("input.parser", {
                                type: "text",
                                value: (<TextParser>attrs.parser()).match_markers!.begin,
                                oninput: m.withAttr("checked", (value) => attrs.parser(
                                    Object.assign(attrs.parser(), {match_markers: {begin: value, end: (<TextParser>attrs.parser()).match_markers!.end}})
                                ))
                            })
                        ])),
                        m(".field", m("label", [
                            m("span.field-label", "Start"),
                            m("input.parser", {
                                type: "text",
                                value: (<TextParser>attrs.parser()).match_markers!.end,
                                oninput: m.withAttr("checked", (value) => attrs.parser(
                                    Object.assign(attrs.parser(), {match_markers: {begin: (<TextParser>attrs.parser()).match_markers!.begin, end: value}})
                                ))
                            })
                        ]))
                    ] : null,

                /*m(".field", m("label", [
                    m("span.field-label", "Is fixed value"),
                    m("input", {
                        type: "checkbox",
                        checked: (<SimpleParser>attrs.parser()).kind === DataKind.Static,
                        oninput: m.withAttr("checked", (checked) => attrs.parser(
                            Object.assign(attrs.parser(), {kind: checked ? DataKind.Static : DataKind.Dynamic})
                        ))
                    })
                ]))*/
            ]

            : []
    }
}