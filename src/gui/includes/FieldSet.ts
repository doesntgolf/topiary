import * as m from "mithril";

export const FieldSet: m.FactoryComponent<{
    legend?: string
}> = () => ({
    view: ({attrs, children}) => attrs.legend !== undefined
        ? m("fieldset", [
            m("legend", attrs.legend),
            children
        ])
        : children,
})