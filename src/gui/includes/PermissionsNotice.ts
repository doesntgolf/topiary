import * as m from "mithril";
import * as stream from "mithril/stream";
import {Stream} from "mithril/stream";

export const PermissionsNotice: m.FactoryComponent = () => {
    let permissions: Stream<{origins: Array<string>, permissions: Array<string>}> = stream({
        origins: [],
        permissions: []
    })
    let accessible = {
        all_origins: false,
        bookmarks: false,
        history: false,
        alarms: false,
        //activeTab: false
    }

    permissions.map((value) => {
        accessible.all_origins = (["http://*/*", "https://*/*"].every(origin => value.origins.includes(origin)));

        ["bookmarks", "history", "alarms"/*, "activeTab"*/].forEach(key => {
            accessible[key] = value.permissions.includes(key);
        })

        if (Object.values(accessible).every(is_accessible => is_accessible)) {
            localStorage.setItem("notice_is_dismissed", "true");
        }
        setTimeout(m.redraw);
    });
    chrome.permissions.getAll(permissions);

    function request_permission(set: {origins?: Array<string>, permissions?: Array<string>}) {
        chrome.permissions.request(set, () => {
            chrome.permissions.getAll(permissions)
        });
    }

    return {
        view: () => m(".notice", [
            m("a", {
                title: "dismiss",
                class: "close-button",
                onclick: (e) => {
                    localStorage.setItem("notice_is_dismissed", "true");
                }
            }, "❌"),

            m("p", {style: "margin-top: 0;"}, "All of the browser permissions that Topiary uses are optional; you can give it access that corresponds to whichever features you intend to use. You can always grant or revoke any permissions on the ", m("a", {href: "/options", oncreate: m.route.link}, "options page"), "."),

            m("ul", [
                !accessible.all_origins ? m("li", [
                    "Grant access to ",
                    m("b", m("a", {
                        onclick: (e) => {
                            e.redraw = false;
                            request_permission({origins: ["https://*/*", "http://*/*"]})
                        }
                    }, "request data from any website")),
                    ". Note that you can also grant access to websites individually on the ",
                    m("a", {href: "/directory", oncreate: m.route.link}, "directory page"),
                    "."
                ]) : null,

                !accessible.bookmarks || !accessible.history ? m("li", [
                    "Grant access to ",
                    !accessible.bookmarks ? m("b", m("a", {
                        onclick: (e) => {
                            e.redraw = false;
                            request_permission({permissions: ["bookmarks"]})
                        }
                    }, "bookmarks")) : null,
                    !accessible.bookmarks && !accessible.history ? " and " : null,
                    !accessible.history ? m("b", m("a", {
                        onclick: (e) => {
                            e.redraw = false;
                            request_permission({permissions: ["history"]})
                        }
                    }, "browsing history")) : null,
                    !accessible.bookmarks && !accessible.history ? ". These are used as primary search sources." : ". This is used as a primary search source."
                ]) : null,

                !accessible.alarms ? m("li", [
                    "Grant access to ",
                    m("b", m("a", {
                        onclick: (e) => {
                            e.redraw = false;
                            request_permission({permissions: ["alarms"]})
                        }
                    }, "set timers and alarms")),
                    ". This is used for automatically checking for updates from remote directories, and for automatically compiling data from a source over time. See the ",
                    m("a", {href: "/following", oncreate: m.route.link}, "following page"),
                    " for more information."
                ]) : null,
            ]),
            
            m("p", {style: "margin-bottom: 0;"}, "Thanks for trying Topiary!")
        ])
    }
}