import * as m from "mithril";
import * as stream from "mithril/stream";
import {Stream} from "mithril/stream";
import {Message, MsgMethod, MsgObject, Preferences} from "../../schema";


export const Options: m.FactoryComponent<{prefs: Stream<Preferences>}> = ({attrs}) => {

    const updater = attrs.prefs.map((value) => {
        chrome.runtime.sendMessage({
            method: MsgMethod.Update,
            object: MsgObject.Preferences,
            args: value
        }, (was_successful) => {
            console.log(was_successful)
        })
    })

    let permissions: Stream<{origins: Array<string>, permissions: Array<string>}> = stream({
        origins: [],
        permissions: []
    })
    permissions.map((value) => {
        setTimeout(m.redraw);
    });
    chrome.permissions.getAll(permissions);

    let storage: StorageEstimate = {};
    navigator.storage.estimate().then(value => {
        storage = value;
    })

    return {
        onremove: () => {
            updater.end(true);
        },
        view: () => [
            //m("aside.sidebar"),
            m("", [
                m("table", [
                    m("thead", m("tr", m("th", {colspan: 2}, m("h2", "Preferences")))),
                    m("tbody", attrs.prefs() ? Object.entries(attrs.prefs()).map(([key, value]) => m("tr", [
                        m("td[align='right']", key),
                        m("td", [key].map(pref => {
                            switch(key) {
                                case "theme":
                                    return m("", ["light", "dark"].map(theme => m("label", m("input", {
                                        type: "radio",
                                        name: "theme",
                                        checked: theme === value,
                                        value: theme,
                                        oninput: (e) => {
                                            attrs.prefs(
                                                Object.assign({}, attrs.prefs(), {theme: theme})
                                            )
                                        }
                                    }), theme)));
        
                                case "redirect_source_prefix":
                                case "include_source_prefix":
                                case "exclude_source_prefix":
                                case "include_tag_prefix":
                                case "exclude_tag_prefix":
                                    return m("input", {
                                        type: "text",
                                        name: key,
                                        value: value,
                                        oninput: m.withAttr("value", value => {
                                            attrs.prefs(
                                                Object.assign({}, attrs.prefs(), {theme: value})
                                            )
                                        })
                                    })
                                default:
                                    return null; // @TODO: rest of preferences
                            }
                        }))
                    ])) : "loading..."),
                ]),
    
                m("table", [
                    m("thead", m("tr", m("th", {colspan: 2}, m("h2", "Origins")))),
                    m("tbody", permissions().origins.map(origin => {
                        return m("tr", [
                            m("td[align='right']", origin),
                            m("td", m("a", {
                                onclick: (e) => {
                                    e.redraw = false;
                                    chrome.permissions.remove({
                                        origins: [origin]
                                    }, (removed) => {
                                        if (removed) chrome.permissions.getAll(permissions);
                                        else alert("Permission couldn't be removed.");
                                    })
                                }
                            }, "Revoke permission."))
                        ])
                    })),
                    !["http://*/*", "https://*/*"].every(origin => permissions().origins.includes(origin)) ? m("tfoot", m("tr", m("td", {colspan: 2}, m("a", {
                        onclick: (e) => {
                            e.redraw = false;
                            chrome.permissions.request({
                                origins: ["http://*/*", "https://*/*"]
                            }, (granted) => {
                                if (granted) chrome.permissions.getAll(permissions);
                            })
                        }
                    }, "Grant access to all origins.")))) : null,
                ]),

                m("table", [
                    m("thead", m("tr", m("th", {colspan: 2}, m("h2", "Permissions")))),
                    m("tbody", ["history", "bookmarks", "alarms"].map(type => m("tr", [
                        m("td[align='right']", type),
                        m("td", m("a", {
                            onclick: (e) => {
                                e.redraw = false;
                                chrome.permissions[permissions().permissions.includes(type) ? "remove" : "request"]({
                                    permissions: [type]
                                }, () => {
                                    chrome.permissions.getAll(permissions);
                                })
                            }
                        }, `${permissions().permissions.includes(type) ? "Revoke" : "Grant"} access to ${type}.`))
                    ]))),
                ]),

                m("h2", m("a", {
                    href: "/errors",
                    oncreate: m.route.link
                }, "Error log")),

                storage.usage && storage.quota ? m("", `Using ${storage.usage} / ${storage.quota} storage space.`) : null
            ])
        ]
    }
}