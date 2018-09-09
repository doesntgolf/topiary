import {Data, DataKind, MappingData, TextData, Format, DataType, Source, Parser, ResultList, ResultListParser,
    Query, Protocol, SourceID, Syndicator, Queryable, URLData, ParserTemplate, MappingParser, Results, Tag} from "../schema";
import {resolve_parameter} from "./resolve_parameter";
import {IDB, Store} from "./database";
import {build_url} from "../utils";
import {type_cast} from "./type_cast";
import {parse_json} from "./parse_json";
import {parse_xml} from "./parse_xml";
import { generate_terms } from "./nlp";


function make_queryable(source: {id: SourceID, name: Source["name"], weight?: number}, syndicator: Syndicator): Queryable {
    let result: Queryable = {
        source: source,
        make_request: (query) => Promise.reject(),
        parse_response: (resp) => null
    }

    switch(syndicator.api.protocol) {

        case Protocol.HTTP:
            result.make_request = (query: Query) => new Promise((resolve, reject) => {
                let fields = resolve_parameter(syndicator.api.input, query.fields);
                if (fields === null || fields.type !== DataType.Mapping) {
                    reject();
                } else {

                    const url = build_url(<URLData>fields.mapping.url);

                    chrome.permissions.contains({
                        origins: [url]
                    }, (has_permission) => {
                        if (!has_permission) {
                            reject("Permission for origin not granted.");
                        } else {
                            let init: {[key: string]: any} = {
                                method: (<TextData>(<MappingData>fields).mapping.method).value,
                                headers: {},
                            }

                            // init.headers["Api-User-Agent"] = "Topiary"; // set only if user's prefence allows

                            if ((<MappingData>fields!).mapping.headers) {
                                Object.entries((<MappingData>fields!).mapping.headers!).forEach(([key, value]): void => {
                                    init.headers[key] = value;
                                })
                            }

                            if ((<MappingData>fields!).mapping.body) {
                                init.body = (<TextData>(<MappingData>fields!).mapping.body).value;
                            }

                            let req = new Request(url, init);

                            return fetch(req).then((resp: Response): Promise<any> => {
                                if (!resp.ok) throw Error("Received non-ok response.");
                                
                                if (syndicator.format === Format.JSON) {
                                    return resp.json();
                                } else {
                                    return resp.text().then((text) => new DOMParser().parseFromString(text, "text/xml"))
                                }
                            })
                            .then(resolve)
                            .catch(reject)
                        }
                    })
                }
            })

            break;

        case Protocol.BrowserBookmarks:
            result.make_request = (query: Query) => new Promise((resolve, reject) => {
                chrome.permissions.contains({
                    permissions: ["bookmarks"]
                }, (granted) => {
                    if (granted) {
                        chrome.bookmarks.search({
                            query: (<TextData>query.fields.phrase).value
                        }, (resp) => {
                            let results = resp.filter(node => node.url !== undefined).map(node => {
                                let result: {[key: string]: any} = {
                                    title: node.title,
                                }
                                if (node.url) result.url = node.url;
                                if (node.children) result.children = node.children;
                                return result;
                            })
                            resolve(results);
                        })
                    } else {
                        reject("Permission to bookmarks not available.");
                    }
                })
            });
            break;

        case Protocol.BrowserHistory:
            result.make_request = (query: Query) => new Promise((resolve, reject) => {
                chrome.permissions.contains({
                    permissions: ["history"]
                }, (granted) => {
                    if (granted) {
                        chrome.history.search({
                            text: (<TextData>query.fields.phrase).value
                        }, (resp) => {
                            const results = resp.filter((node: chrome.history.HistoryItem) => {
                                return node.url !== undefined
                                    && node.url.startsWith("http")
                                    && ![".google.com/search", "://duckduckgo.com/?q="].some(search_page => node.url!.includes(search_page))
                            })
                            .map((node: chrome.history.HistoryItem) => ({
                                title: node.title,
                                url: node.url
                            }))
                            resolve(results);
                        })
                    } else {
                        reject("Permission to history not available.");
                    }
                })
            });
            break;

        case Protocol.Directory:
            result.make_request = (query: Query) => new Promise((resolve, reject) => {
                if (query.fields.phrase !== undefined) {
                    resolve( search_directory(String(query.fields.phrase.value)) );
                } else {
                    reject();
                }
            });
            break;

        case Protocol.QueryStatistics:
            result.make_request = (query: Query) => Promise.reject();
            break;

        case Protocol.UploadedData:
            result.make_request = (query: Query) => Promise.reject();
            break;

        default:
            throw(`unknown protocol: ${syndicator.api}`);
    }


    switch(syndicator.format) {
        case Format.JSON:
            result.parse_response = (resp) => parse_json(resp, syndicator.parser);
            break;

        case Format.XML:
        case Format.HTML:
            result.parse_response = (resp) => parse_xml(resp, syndicator.parser);
            break;
        
        default:
            throw("unknown format");
    }

    return result;
}



export function prepare_sources(
    query: Query,
    sources: Array<Source>,
    query_phrase?: string
): {
    forwardables: Results["elsewhere"],
    queryables: Array<Queryable>
 } {
    let the_forwardables: Results["elsewhere"] = [];

    let the_queryables = sources.reduce((acc: Array<Queryable>, source: Source): Array<Queryable> => {

        query.options.include_ids = query.options.include_ids || [];
        query.options.include_tags = query.options.include_tags || [];

        if (query.options.include_ids.some((q_id) => source.id.key === q_id.key && source.id.directory_key === q_id.directory_key)
            || query.options.include_tags.some((q_tag) => source.tags.some(s_tag => s_tag.text === q_tag))
            /*|| source.syndicate_from!.triggers.some((trigger): boolean => { // @TODO where to handle triggers?
            
                if (altered_query.fields.phrase === undefined || altered_query.fields.phrase.type !== DataType.Text) {
                    return false;
                }
                let phrase = (<string>altered_query.fields.phrase.value);
                let term = trigger.term;

                if (!trigger.case_sensitive && trigger.type !== "regex") {
                    phrase = phrase.toLowerCase();
                    term = term.toLowerCase();
                }

                switch(trigger.type) {
                    case "regex":
                        return RegExp(term).test(phrase);
                    case "starts":
                        return phrase.startsWith(term);
                    case "contains":
                        return phrase.includes(term);
                    case "ends":
                        return phrase.endsWith(term);
                    default:
                        return false;
                }
            })*/
        ) {
            if (source.syndicate_from !== undefined) {
                acc.push( make_queryable({
                    id: source.id,
                    name: source.name,
                    weight: source.weight || 1
                }, source.syndicate_from) );
            }

            if (source.forward_to !== undefined) {
                let url_params = resolve_parameter(source.forward_to, query.fields);
                if (url_params !== null && url_params.type === DataType.Mapping) {
                    let url = build_url(<URLData>url_params);
                    the_forwardables!.push({
                        source: {
                            source: source.id,
                            name: source.name
                        },
                        url: url
                    });
                }
            }
        }
        return acc;
    }, [])

    return {
        forwardables: the_forwardables,
        queryables: the_queryables
    };
}



export function search_directory(phrase: string): Promise<Array<{score: number, data: Source}>> {
    return new Promise((resolve, reject) => {
        let terms = generate_terms(phrase);

        let named_reqs: Array<{
            field: "name"|"description"|"tags",
            term: string,
            req: IDBRequest
        }>;
        
        let reqs: Array<IDBRequest>;
        new IDB().open([Store.Directory], "readonly", transaction => {
            let index = transaction.objectStore(Store.Directory).index("terms");
    
            named_reqs = ["name", "description", "tags"].reduce((acc: Array<{
                field: "name"|"description"|"tags",
                term: string,
                req: IDBRequest
            }>, field: "name"|"description"|"tags") => {
                terms.forEach(term => {
                    acc.push({
                        field: field,
                        term: term,
                        req: index.getAll([field, term])
                    })
                })
                return acc;
            }, [])
        })
        .then(() => {
    
            let max = 0;
    
            const results = named_reqs.reduce((acc: Array<{
                score: number,
                data: Source
            }>, group) => {
                const sources = <Array<Source>>group.req.result;
                const importance = group.field === "name" ? 15 : group.field === "tags" ? 5 : 1;
    
                sources.forEach(source => {
                    const match = acc.find(item => item.data.id.key === source.id.key && item.data.id.directory_key === source.id.directory_key);
                    const rel = source.relevance![group.field][group.term] * importance;
    
                    if (match === undefined) {
                        acc.push({
                            score: rel,
                            data: source
                        })
    
                        if (rel > max) {
                            max = rel;
                        }
                    } else {
                        match.score += rel;
                        if (match.score > max) {
                            max = match.score;
                        }
                    }
                })
                
                return acc;
            }, [])
            .map((result) => ({
                score: result.score / max,
                data: result.data
            }))
    
            resolve(results);
        })
        .catch(reject)
    })
}


export function search_tags(phrase: string): Promise<Array<{score: number, data: Tag}>> {
    return new Promise((resolve, reject) => {
        let terms = generate_terms(phrase);

        let term_reqs: Array<IDBRequest>;
        
        new IDB().open([Store.Tags], "readonly", transaction => {
            let index = transaction.objectStore(Store.Tags).index("terms");
            term_reqs = terms.map(term => index.getAll(term));
        })
        .then(() => {
    
            let max = 0;
    
            const results = term_reqs.reduce((acc: Array<{
                score: number,
                data: Tag
            }>, group) => {
                group.result.forEach(tag => {
                    const match = acc.find(item => item.data.text === tag.text);
    
                    if (match === undefined) {
                        acc.push({
                            score: 1,
                            data: tag
                        })
                    } else {
                        match.score += 1;
                        if (match.score > max) {
                            max = match.score;
                        }
                    }
                })
                
                return acc;
            }, [])
            .map((result) => ({
                score: result.score / max,
                data: result.data
            }))
    
            resolve(results);
        })
        .catch(reject)
    })
}