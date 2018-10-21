import {Query, Message, MsgMethod, MsgObject, Data, DataKind, DataType, Preferences} from "../schema";
import {version} from "../version";


import * as m from "mithril";
import * as stream from "mithril/stream";
import {Stream} from "mithril/stream";


// Pages
import {Home} from "./pages/Home";
import {Directory} from "./pages/Directory";
import {Options} from "./pages/Options";
import {Search} from "./pages/Search";
import {SourceEditor} from "./pages/SourceEditor";
import {About} from "./pages/About";
import {Guide} from "./pages/Guide";
import {SavedQueries} from "./pages/SavedQueries";
import {Playground} from "./pages/Playground";
import {TagIndex} from "./pages/TagIndex";
import {TagDetail} from "./pages/TagDetail";
import {Stats} from "./pages/Stats";
import {SingleSource} from "./pages/SingleSource";
import {TagEditor} from "./pages/TagEditor";


import {Logo} from "./includes/Logo";
import {QueryForm} from "./includes/QueryForm";


const Layout: m.FactoryComponent<{
    page: "home"|"search"|"directory"|"about"|"guide"|"saved"|"tags"|"playground"|"options"|"stats"|"",
    header: m.Children
}> = () => ({
    view: ({attrs, children}) => [
        m("header", {class: `${attrs.page}-page`}, [
            m(Logo, {full: attrs.page === "home"}),

            attrs.header,

            m("nav", [
                {name: "Search", path: "/", keys: ["search", "home"]},
                {name: "Directory", path: "/directory", keys: ["directory"]}
            ].map(page => m("a", {
                href: page.path,
                class: page.keys.includes(attrs.page) ? "active" : "inactive",
                oncreate: m.route.link
            }, page.name)))
        ]),

        m("main", {class: `${attrs.page}-page`}, children),

        m("footer", {class: `${attrs.page}-page`}, [
            in_popup ? m("a", {
                onclick(e) {
                    e.redraw = false;
                    chrome.tabs.create({url: location.href});
                }
            }, "Open in new tab.") // This won't work well on search pages because we store so much of the query in history.state :/

            : m("nav", [[
                {name: "About", path: "/about", key: "about"},
                {name: "Guide", path: "/guide", key: "guide"}
            ], [
                {name: "Saved queries", path: "/saved", key: "saved"},
                {name: "Tags", path: "/tags", key: "tags"},
                {name: "Playground", path: "/playground", key: "playground"}
            ], [
                {name: "Options", path: "/options", key: "options"},
                {name: "Stats", path: "/stats", key: "stats"},
                //{name: "Error log", path: "/errors", key: "errors"}
            ]].map(grouping => m(".grouping", [
                "[",
                grouping.map((page, index) => [
                    index !== 0 ? "‧" : null,
                    m("a", {
                        href: page.path,
                        class: page.key === attrs.page ? "active" : "inactive",
                        oncreate: m.route.link
                    }, page.name)
                ]),
                "]"
            ]))),
            
            m(".signature", `topiary ${version}`)
        ])
    ]
})


let user_prefs: Stream<Preferences> = stream();
user_prefs.map((value) => {
    //document.body.dataset.theme = value.theme;
    //document.body.dataset.layout = value.layout;
    setTimeout(m.redraw);
})
chrome.runtime.sendMessage({
    method: MsgMethod.Read,
    object: MsgObject.Preferences
}, user_prefs)



function register_error(message, source, lineno, colno, error): void {
    chrome.runtime.sendMessage({
        object: MsgObject.Errors,
        method: MsgMethod.Create,
        arg: {
            timestamp: Date.now(),
            message: message,
            source: source,
            lineno: lineno,
            colno: colno,
            error: error
        }
    }, (success) => {
        if (!success) console.error("Failed to log error... Argh.");
    })
}
window.onerror = register_error;


/**
 * This way of handling queries sucks.
 * 
 * URL querystrings should be the canonical source for building a query from,
 * not history.state. The reason it's not currently that way is because I'm
 * not super fond of the way mithril builds querystrings for nested structures
 * (like Query).
 * 
 * Because of this, history.state is the canonical source of queries, with a 
 * couple fallback ways to get the 'phrase' field from a querystring. This also
 * means that the only way to create a nontrivial query is through a form in
 * the application. :/
 * 
 * Should either bite the bullet and just use mithril's querystrings, or write
 * a querystring parser for the way I want the querystrings to look.
 */
function retrieve_query(): Query {
    let query: Query = {fields: {}, source_specific: [], options: {include_tags: ["default"]}, pipeline: []};

    if (history.state && history.state.query) {
        query = history.state.query;
    } else if (m.route.param("omnibar_phrase") !== undefined) {
        // handle querystring from browser omnibar query
        query.fields.phrase = {type: DataType.Text, value: String(m.route.param("omnibar_phrase")).split("+").join(" ")};
    } else if (m.route.param("phrase") !== undefined) {
        query.fields.phrase = {type: DataType.Text, value: m.route.param("phrase")};
    }

    history.replaceState({query: query}, "");
    return query;
}


const default_vars = m.parseQueryString(location.search);
const in_popup = default_vars.popup !== undefined;
let phrase = default_vars.phrase;

m.route.prefix("?");
m.route(document.body, "/", {
    "/": {
        onmatch: () => {
            if (phrase !== undefined) {
                m.route.set("/search", null, {state: {
                    query: <Query>{
                        fields: {
                            "phrase": {
                                kind: DataKind.Static,
                                type: DataType.Text,
                                value: String(phrase)
                            }
                        },
                        source_specific: [],
                        options: {
                            include_tags: ["default"]
                        },
                        pipeline: []
                    }
                }});
                phrase = undefined;
            }
            return Home;
        },
        render: (vnode) => m(Layout, {
            page: "home",
            header: m(QueryForm, {
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
                    options: {include_tags: ["default"]}
                },
                submit_text: "Search"
            }),
        }, vnode)
    },
    "/search": {
        onmatch: (args) => {
            args.query = stream(retrieve_query());
            args.face = stream("List");
            args.in_popup = in_popup;
            args.popup_forwards = user_prefs() ? user_prefs().browser_popup_forwards : "";
            return Search;
        },
        render: (vnode) => m(Layout, {
            page: "search",
            header: m(QueryForm, {
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
                    options: vnode.attrs.query().options
                },
                submit_text: "Search"
            })
        }, vnode)
    },
    "/directory": {
        onmatch: (args) => args.new !== undefined ? SourceEditor : Directory,
        render: (vnode) => m(Layout, {
            page: vnode.attrs.new === undefined ? "directory" : "",
            header: m("h1", "Directory")
        }, vnode)
    },
    /*"/directory/:remote": { // @TODO
        onmatch: (args) => args.edit !== undefined ? SourceEditor : SourceQueryForm,
        render: (vnode) => {
            vnode.attrs.key = String(vnode.attrs.key);
            return m(Layout, {
                page: "",
                header: m("h1", vnode.attrs.edit !== undefined ? "Editor" : "Query")
            }, vnode);
        }
    },*/
    "/directory/:remote/:key": {
        onmatch: (args) => args.edit !== undefined ? SourceEditor : SingleSource,
        render: (vnode) => {
            return m(Layout, {
                page: "",
                header: m("a", {
                    href: vnode.attrs.edit !== undefined ? `/directory/${vnode.attrs.remote}/${vnode.attrs.key}` : "/directory",
                    oncreate: m.route.link
                }, m("b", vnode.attrs.edit !== undefined ? "← source" : "← directory"))
            }, vnode);
        }
    },
    "/options": {
        render: (vnode) => m(Layout, {
            page: "options",
            header: m("h1", "Options")
        }, m(Options, {prefs: user_prefs}))
    },

    "/about": {
        onmatch: () => About,
        render: (vnode) => m(Layout, {
            page: "about",
            header: m("h1", "About")
        }, vnode)
    },
    "/guide": {
        onmatch: () => Guide,
        render: (vnode) => m(Layout, {
            page: "guide",
            header: m("h1", "Guide")
        }, vnode)
    },
    "/saved": {
        onmatch: () => SavedQueries,
        render: (vnode) => m(Layout, {
            page: "saved",
            header: m("h1", "Saved queries")
        }, vnode)
    },
    "/tags": {
        onmatch: () => TagIndex,
        render: (vnode) => m(Layout, {
            page: "tags",
            header: m("h1", "Tags")
        }, vnode)
    },
    "/tags/:text": {
        onmatch: (args) => args.edit !== undefined ? TagEditor : TagDetail,
        render: (vnode) => m(Layout, {
            page: "",
            header: m("a", {href: "/tags", oncreate: m.route.link}, m("b", "← all tags"))
        }, vnode)
    },
    "/playground": {
        onmatch: () => Playground,
        render: (vnode) => m(Layout, {
            page: "playground",
            header: m("h1", "Playground")
        }, vnode)
    },
    "/stats": {
        onmatch: () => Stats,
        render: (vnode) => m(Layout, {
            page: "stats",
            header: m("h1", "Query statistics")
        }, vnode)
    }
});
