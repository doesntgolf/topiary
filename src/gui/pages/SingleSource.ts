import * as m from "mithril";
import * as stream from "mithril/stream";
import {Stream} from "mithril/stream";

import {Source, MsgMethod, MsgObject, Message} from "../../schema";
import {set_title} from "../../utils";

import {SourceQueryForm} from "../includes/SourceQueryForm";

export const SingleSource: m.FactoryComponent<{remote: string, key: string}> = ({attrs}) => {
    let source: Source|null = null;
    chrome.runtime.sendMessage(<Message>{
        method: MsgMethod.Read,
        object: MsgObject.Sources,
        args: {
            id: {
                key: attrs.key,
                directory_key: attrs.remote
            }
        }
    }, (resp) => {
        source = resp;
        m.redraw();
    });

    set_title("a source");

    return {
        view: () => source !== null
            ? m(SourceQueryForm, {
                    key: `${source.id.key}__${source.id.directory_key}`,
                    source: source
            })  : "loading..."
    }
}