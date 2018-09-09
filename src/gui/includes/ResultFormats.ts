import * as m from "mithril";
import * as stream from "mithril/stream";
import {Stream} from "mithril/stream";

import {Result, Output, TextOutput, DataType} from "../../schema";
import {QueryForm} from "./QueryForm";
import {Pagination} from "./Pagination";

export const ResultFormats: {
    [name: string]: m.FactoryComponent<{
        results: Array<Result>,
        key: string,
        show_source: boolean
    }>
} = {
    List: ({attrs}) => {
        let third_column: Stream<{
            index: number;
            key: string;
            content: Array<{
                key: string,
                base?: any,
                item?: any
            }>
        } | undefined> = stream();
        
        third_column.map(value => {
            setTimeout(m.redraw);
        })

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

            let output = document.querySelector("output");
            if (output && scrollY > output.offsetTop) {
                scrollTo({top: output.offsetTop, behavior: "smooth"});
            }
        })
        console.log(attrs);
        
        return {
            view: ({attrs}) => [
                m(".results-length", attrs.results.length === 0
                    ? "No results found"
                    : attrs.results.length === 1
                        ? "One result found"
                        : `Results ${low + 1} - ${high < attrs.results.length ? high : attrs.results.length} of ${attrs.results.length}`
                ),

                m(".results", [
                    m("ol.result-list", {
                        class: third_column() ? "has-active-content" : "no-active-content"
                    }, attrs.results.slice(low, high).map((result, index) => m(ListResult, {
                        key: `result__${attrs.key}__${result.mapping.identifier ? result.mapping.identifier.value : result.mapping.link ? result.mapping.link.value : index + low}`,
                        result: result,
                        index: index + low,
                        third_column: third_column,
                        show_source: attrs.show_source
                    }))),

                    third_column() !== undefined ? m(".result-content", {
                        key: `third_column__${attrs.key}__${third_column()!.index}`
                    }, third_column()!.content.map(content_piece => {
                        switch(content_piece.key) {
                            case "Embedded content":
                                /**
                                 * Create a base tag for relative URLs within the embedded content.
                                 * 
                                 * This problem was first observed on the embedded Wikipedia Main Page, where
                                 * links began with the pathname, and image sources didn't have a protocol,
                                 * so they used the extension's "chrome-extension://" protocol, and none of 
                                 * it worked.
                                 * 
                                 * @NOTE: as long as we're already going through with this step, it probably
                                 * makes sense to inject a stylesheet here too, doesn't it?
                                 */
                                let doc = new DOMParser().parseFromString(content_piece.item.value, "text/html");
                                let base = document.createElement("base");
                                if (content_piece.base && content_piece.base.value !== undefined) {
                                    base.href = content_piece.base.value;
                                } else {
                                    // Is this a reasonable default? At least then protocol-less
                                    // stuff will work.
                                    base.href = "http://example.com/";
                                }
                                doc.head.appendChild(base);
                                let html = new XMLSerializer().serializeToString(doc);

                                return m("iframe.result-html", {
                                    srcdoc: html,
                                    sandbox: "allow-same-origin",
                                    onload: (e) => { // try to set the height to the full size of the inner iframe
                                        e.redraw = false;
                                        e.path[0].setAttribute("height", String((e.path[0] as HTMLIFrameElement).contentWindow!.document.documentElement.scrollHeight));
                                    }
                                });

                            case "Remote content":
                                return m("iframe.result-iframe", {
                                    src: content_piece.item.value,
                                    sandbox: "allow-scripts"
                                });
                                
                            case "Audio":
                                return m("audio[controls]", {src: content_piece.item.value});
                            case "Video":
                                return m("video[controls]", {src: content_piece.item.value});
                            case "Image":
                                return m("img", {src: content_piece.item.value});
                            default:
                                return null;
                        }
                    })) : null
                ]),

                attrs.results.length > 0 ? m(Pagination, {
                    page: page,
                    per_page: 15,
                    length: attrs.results.length
                }) : null
            ]
        }
    },

    Table: () => {
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

            let output = document.querySelector("output");
            if (output && scrollY > output.offsetTop) {
                scrollTo({top: output.offsetTop, behavior: "smooth"});
            }
        })
        
        return {
            view: ({attrs}) => [
                m(".results-length", attrs.results.length === 0
                    ? "No results found"
                    : attrs.results.length === 1
                        ? "One result found"
                        : `Results ${low + 1} - ${high < attrs.results.length ? high : attrs.results.length} of ${attrs.results.length}`
                ),

                m(".results", m("table.results-table", [
                    m("thead", [
                        m("tr", ["Title", "Link", "Source"].map(label => m("th", label)))
                    ]),
                    m("tbody", attrs.results.slice(low, high).map(result => m("tr", [
                        m("td", result.mapping.title ? result.mapping.link ? m("a", {
                            href: result.mapping.link.value,
                            class: "content-link",
                            rel: "external"
                        }, result.mapping.title.value) : result.mapping.title.value : ""),

                        m("td", result.mapping.link ? m("a.result-url", {
                            href: result.mapping.link.value,
                            rel: "external"
                        }, result.mapping.link.value) : ""),

                        m("td", result.source ? result.source.name : ""),

                    ])))
                ])),

                attrs.results.length > 0 ? m(Pagination, {
                    page: page,
                    per_page: 15,
                    length: attrs.results.length
                }) : null
            ]
        }
    },

    Grid: () => ({
        view: ({attrs}) => ["Unimplemented!"]
    }),

    LineGraph: () => ({
        view: ({attrs}) => ["Unimplemented!"]
    })
}


const ListResult: m.FactoryComponent<{
    result: Result,
    index: number,
    key: string,
    third_column: Stream<{
        index: number;
        key: string;
        content: Array<{key: string, item?: any}>
    } | undefined>,
    show_source: boolean
}> = ({attrs}) => {

    let yielded_queries: Array<{key: string, item?: any}> = (attrs.result.yielded_queries || []).map((yielded_query, index) => ({
        key: `Query-${index}`,
        item: yielded_query
    }));

    const sub_tabs: Array<{key: string, item?: any}> = yielded_queries.concat([{
        key: "children",
        item: attrs.result.mapping.children
    }, {
        key: "metadata",
        item: attrs.result.mapping.metadata
    }])
    .filter(field => field.item !== undefined)

    const active_tab: Stream<{key: string, item?: any}|undefined> = stream();
    active_tab.map(() => {
        m.redraw();
    })
    if (attrs.index === 0 && sub_tabs.length > 0) {
        active_tab(sub_tabs[0]);
    }


    const embedded: {
        index: number;
        key: string;
        content: Array<{key: string, item?: any}>
    } = {
        index: attrs.index,
        key: attrs.key,
        content: [{
            key: "Embedded content",
            index: attrs.index,
            base: attrs.result.mapping.link,
            item: attrs.result.mapping.html
        }, {
            key: "Remote content",
            index: attrs.index,
            item: attrs.result.mapping.iframe_url
        }, {
            key: "Audio",
            index: attrs.index,
            item: attrs.result.mapping.audio_url
        }, {
            key: "Video",
            index: attrs.index,
            item: attrs.result.mapping.video_url
        }, {
            key: "Image",
            index: attrs.index,
            item: attrs.result.mapping.image_url
        }]
        .filter(field => field.item !== undefined)
    }
    
    if (attrs.index === 0 && embedded.content.length > 0) {
        attrs.third_column(embedded);
    }

    return {
        onremove: () => {
            if (attrs.third_column() && attrs.third_column()!.key === attrs.key) {
                attrs.third_column(undefined);
            }
        },
        view: ({attrs}) => m("li.result", {
            class: attrs.third_column() && attrs.third_column()!.key === attrs.key ? "has-active-content" : "no-active-content"
        }, [
            m(".result-main-content", {
                class: embedded.content.length > 0 ? "clipped" : "not-clipped"
            }, [
                attrs.result.mapping.title
                    ? m("h2.result-title", attrs.result.mapping.link
                        ? m("a", {
                            href: <string>attrs.result.mapping.link.value,
                            class: "content-link",
                            rel: "external",
                            onclick: (e) => {
                                e.redraw = false;
                                /*if (in_popup) {
                                    e.preventDefault();
                                    chrome.tabs.create({url: <string>attrs.result.mapping.link!.value});
                                }*/
                            }
                        }, <string>attrs.result.mapping.title.value)
                        : <string>attrs.result.mapping.title.value)
                    : null,

                attrs.result.mapping.link
                    ? m(".result-links", [
                        m("a.result-url", {
                            href: <string>attrs.result.mapping.link.value,
                            rel: "external",
                            title: <string>attrs.result.mapping.link.value
                        }, <string>attrs.result.mapping.link.value),
                        m("span.view-more", [
                            " [ ",
                            m("a.result-archive-link", {
                                href: `https://web.archive.org/web/${attrs.result.mapping.link.value}`,
                                rel: "external"
                            }, "archive"),
                            " ]"
                        ])
                    ]) : null,

                
                /*attrs.result.mapping.date && attrs.result.mapping.date.value && !isNaN( Date.parse(String(attrs.result.mapping.date.value)) )
                    ? m("time.result-datetime", {
                        datetime: new Date(<string>attrs.result.mapping.date.value).toISOString()
                    }, `${new Date(<string>attrs.result.mapping.date.value).toDateString()} ${new Date(<string>attrs.result.mapping.date.value).toLocaleTimeString()}`)
                    : null,*/

                attrs.result.mapping.date ? m(ResultDate, {date: attrs.result.mapping.date.value}) : null,

                attrs.result.mapping.description
                    ? m(".result-description", highlight_matches(attrs.result.mapping.description))
                    : null,

                attrs.show_source && attrs.result.source ? m("cite.result-source-name", `via ${attrs.result.source.name}`) : null,

                attrs.result.mapping.score ? m(".result-score", attrs.result.mapping.score.value) : null,


                // WARNING: this is so hacky and uncool.
                sub_tabs.length > 0 ? m(".result-tabs", {
                    class: active_tab() ? "active" : "inactive"
                }, sub_tabs.map(tab => {
                    let label = "";
                    switch(tab.key) {
                        case "children":
                            label = "Children";
                            break;
                        case "metadata":
                            label = "Metadata";
                            break;
                        default:
                            label = tab.item.name;
                    }
                    return m("a.result-tab", {
                        class: active_tab() && active_tab()!.key === tab.key ? "active" : "inactive",
                        onclick: (e) => {
                            if (active_tab() && active_tab()!.key === tab.key) {
                                active_tab(undefined);
                            } else {
                                active_tab(tab);
                            }
                        }
                    }, label)
                })) : null,

                [1].map(() => {
                    if (active_tab()) {
                        switch(active_tab()!.key) {
                            case "children":
                                /*return m(ResultFormats.List, {
                                    results: active_tab()!.item.list,
                                    key: `children__${active_tab()!.key}`,
                                    show_source: false
                                })*/
                                return m("ul", active_tab()!.item.list.map(item => {
                                    return m("li", {style: "margin-bottom: 8px;"}, Object.entries(item.mapping).map(([key, inner_item]) => {
                                        return [`${key}: ${(<TextOutput>inner_item).value}`, m("br")];
                                    }))
                                }));
                            case "metadata":
                                return m("ul", Object.keys(active_tab()!.item.mapping).map(key => {
                                    let field: Output = active_tab()!.item.mapping[key];
                                    return m("li", `${key}: ${(<TextOutput>field).value}`);
                                }));
                            default:
                                return m(QueryForm, {
                                    template: active_tab()!.item,
                                    submit_text: active_tab()!.item.options.redirect ? "Go" : "Search"
                                })
                        }
                    } else {
                        return null;
                    }
                })
            ]),
            
            embedded.content.length > 0 ? m("a.content-tab", {
                class: attrs.third_column() && attrs.third_column()!.key === attrs.key ? "active" : "inactive",
                onclick: (e) => {
                    if (attrs.third_column() && attrs.third_column()!.key === attrs.key) {
                        attrs.third_column(undefined);
                    } else {
                        attrs.third_column(embedded);
                    }
                }
            }, [
                m("span", embedded.content.map(tab => tab.key).join(", ")),
                m("span.content-tab-arrow", attrs.third_column() && attrs.third_column()!.key === attrs.key ? "▸" : "▹")
            ]) : null,
        ])
    }
}

const ResultDate: m.FactoryComponent<{date: string|number}> = ({attrs}) => {
    let date = new Date(attrs.date);
    let now = new Date();
    
    let day = date.toDateString();
    if (day === now.toDateString()) {
        day = "today";
    } else if (day === new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1
    ).toDateString()) {
        day = "yesterday";
    }

    let hour = date.getHours();
    let am_pm = "AM";
    if (hour >= 12) {
        hour -= 12;
        am_pm = "PM";
    } else if (hour === 0) {
        hour = 12;
    }
    let minutes = String( date.getMinutes() );
    if (minutes.length === 1) {
        minutes += "0";
    }
    let time = `${hour}:${minutes} ${am_pm}`;

    return {
        view: ({attrs}) => isNaN(Date.parse(String(attrs.date)))
            ? null
            : m("time.result-datetime", {
                datetime: date.toISOString()
            }, `${day}, ${time}`)
    }
}


// @NOTE: if the matches cross paths at all, this highlighter messes the text up.
function highlight_matches(field: TextOutput): Array<any> {
    if (field.type === DataType.Text && field.matches) {
        let cursor_position = 0;

        return field.matches.reduce((acc: Array<any>, match: {begin: number, end: number}): Array<any> => {
            let rest = acc.pop();
            match.begin -= cursor_position;
            match.end -= cursor_position;

            if (match.begin >= 0 && match.end > match.begin) {
                acc = acc.concat(
                    rest.slice(0, match.begin),
                    m("mark", rest.slice(match.begin, match.end)),
                    rest.slice(match.end)
                );
            } else {
                acc = acc.concat(rest);
            }
    
            cursor_position += match.end;
            return acc;
        }, [field.value]);
    } else {
        return [field.value];
    }
}