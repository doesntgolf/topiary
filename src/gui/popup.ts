/**
 * This implements the WebExtension popup page:
 * <https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Popups>
 */

import * as m from "mithril";
import * as stream from "mithril/stream";
import {Stream} from "mithril/stream";
import {Message, MsgMethod, MsgObject, Preferences} from "../schema";

const Popup: m.FactoryComponent = () => ({
    view: () => [
        m("", "popup")
    ]
})

let user_prefs: Stream<Preferences> = stream();
user_prefs.map((value) => {
    document.body.dataset.theme = value.theme;
    document.body.dataset.layout = value.layout;
    setTimeout(m.redraw);
})
chrome.runtime.sendMessage({
    method: MsgMethod.Read,
    object: MsgObject.Preferences
}, user_prefs)


m.mount(document.body, {view: () => m(Popup)});