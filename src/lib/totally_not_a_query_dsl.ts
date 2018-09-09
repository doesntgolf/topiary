import {Query, Source, DataType} from "../schema";

/**
 * OK it's kind of a query DSL.
 */
export function query_dsl(query: Query, sources: Array<Source>): Query {
    if (query.fields.phrase !== undefined && query.fields.phrase.type === DataType.Text) {
        if (!query.options.include_ids) query.options.include_ids = [];
        if (!query.options.exclude_ids) query.options.exclude_ids = [];

        let new_phrase = "";

        (<string>query.fields.phrase.value).split(" ").forEach((term, index) => {
            if (term.startsWith("!")) {
                if (query.options.redirect === undefined) {
                    let match = sources.find(source => source.keys.includes(term.substring(1)));
                    if (match !== undefined) {
                        query.options.redirect = match.id;
                    }
                } else {
                    new_phrase += (index === 0 ? "" : " ") + term.substring(1);
                }
            
            } else if (term.startsWith("+")) {
                let match = sources.find(source => source.keys.includes(term.substring(1)));
                if (match !== undefined) {
                    query.options.include_ids!.push(match.id);
                }

            } else if (term.startsWith("-")) {
                let match = sources.find(source => source.keys.includes(term.substring(1)));
                if (match !== undefined) {
                    query.options.exclude_ids!.push(match.id);
                }

            } else {
                if (term.startsWith("\\")) term = term.substring(1);
                new_phrase += (index === 0 ? "" : " ") + term;
            }
        })

        query.fields.phrase.value = new_phrase;
    }
    return query;
}