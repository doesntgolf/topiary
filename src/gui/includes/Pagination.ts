import * as m from "mithril";
import * as stream from "mithril/stream";
import {Stream} from "mithril/stream";

export const Pagination: m.FactoryComponent<{
    page: Stream<number>,
    per_page: number,
    length: number
}> = () => ({
    view: ({attrs}) => m(".pagination", [
        attrs.page() > 2 ? m("a.pagination-link", {
            onclick: (e) => {
                attrs.page(1);
            },
        }, "first") : null,

        attrs.page() > 1 ? m("a.pagination-link.sequential", {
            onclick: (e) => {
                attrs.page(attrs.page() - 1);
            },
            rel: "prev"
        }, "previous") : null,

        m(".current-page", `Page ${attrs.page()} of ${Math.ceil(attrs.length / attrs.per_page)}`),

        attrs.page() < Math.ceil(attrs.length / attrs.per_page) ? m("a.pagination-link.sequential", {
            onclick: (e) => {
                attrs.page(attrs.page() + 1);
            },
            rel: "next"
        }, "next") : null,

        attrs.page() + 1 < Math.ceil(attrs.length / attrs.per_page) ? m("a.pagination-link", {
            onclick: (e) => {
                attrs.page(Math.ceil(attrs.length / attrs.per_page));
            }
        }, "last") : null
    ])
})

