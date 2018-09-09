/**
 * This implements the WebExtension options page:
 * <https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Options_pages>
 * 
 * It's the same as the in-application options page,
 * it just doesn't have the top and bottom navigation.
 */

import * as m from "mithril";
import * as stream from "mithril/stream";
import {Stream} from "mithril/stream";
import {Message, MsgMethod, MsgObject, Preferences} from "../schema";

import {Options} from "./pages/Options";

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


m.mount(document.body, {view: () => m(Options, {prefs: user_prefs})});