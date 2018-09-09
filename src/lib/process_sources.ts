import {RemoteSource, Source, Tag} from "../schema";

import {generate_terms, relevance_map} from "./nlp";

// remote_source_list.map(remote_to_local);
// returns null if unable to decipher remote
export function remote_to_local(remote: RemoteSource, directory: string): Source|null {
    return {
        id: {
            key: remote.key,
            directory_key: directory
        },
        name: remote.name,
        subscribed: true,
        description: remote.description,
        weight: 1,
        is_active: true,
        homepage: remote.homepage,
        related_sources: remote.related_sources,
        keys: remote.keys,
        tags: remote.tags.map(text => ({text: text})),
        forward_to: remote.forward_to,
        syndicate_from: remote.syndicate_from
    }
}


export function index_source(source: Source): Source {
    source.terms = [];
    source.relevance = {};

    ["name", "description"].forEach(key => {
        if (source[key] !== undefined) {
            let field_terms = generate_terms(source[key]);

            field_terms.forEach(term => {
                source.terms!.push([key, term]);
            });
    
            source.relevance![key] = relevance_map(field_terms);
        }
    })

    let tags = source.tags.map(tag => tag.text);
    tags.forEach(term => {
        source.terms!.push(["tags", term])
    });
    source.relevance!["tags"] = relevance_map(tags);
    
    return source;
}


export function index_tag(tag: Tag): Tag {
    tag.terms = generate_terms(tag.text);
    return tag;
}