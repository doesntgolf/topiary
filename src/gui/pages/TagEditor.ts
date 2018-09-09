import * as m from "mithril";
import * as stream from "mithril/stream";
import {Stream} from "mithril/stream";

import {Tag, MsgMethod, MsgObject, Source, Message, DataKind, DataType} from "../../schema";
import {set_title} from "../../utils";

export const TagEditor: m.FactoryComponent<{text: string}> = ({attrs}) => {
    set_title(`"${attrs.text}" tag`);

    return {
        view: ({attrs}) => [
            m("", [
                m("h1.source-name", `"${attrs.text}" tag`),
            ])
        ]
    }
}