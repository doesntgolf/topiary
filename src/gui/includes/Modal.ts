import * as m from "mithril";

export const Modal: m.FactoryComponent = () => ({
    view: ({children}) => m("dialog", {
        oncreate: ({dom}) => {
            (<HTMLDialogElement>dom).showModal();
        }
    }, children)
})