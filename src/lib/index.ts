/**
 * This serves as the entry point and router for the backend.
 * 
 * It listens for messages, connections, and browser events, 
 * and responds or proxies them off to the right place.
 */


import {Source, Query, Format, Status, Results, Preferences, Message, MsgMethod, MsgObject, RemoteSource, URLData, PortMessage, PortObject,
    Result, Follow, SavedQuery, Tag, SourceTag, Data, DataKind, DataType, Protocol, Queryable, TextData, TextOutput} from "../schema";
import {build_url} from "../utils";

import {search} from "./syndicator";
import {query_dsl} from "./totally_not_a_query_dsl";
import {remote_to_local} from "./process_sources";
import {resolve_parameter} from "./resolve_parameter";
import {Store, IDB} from "./database";
import {prepare_sources, search_directory, search_tags} from "./queryable";
import {index_source, index_tag} from "./process_sources";

const topiary_version = "{{ version }}";


chrome.runtime.onMessage.addListener((req: Message, _, send_response) => {
    switch(req.object) {

        // Preferences
        case MsgObject.Preferences:

            switch(req.method) {
                case MsgMethod.Read:
                    let request: IDBRequest;
                    new IDB().open([Store.Keyval], "readonly", transaction => {
                        request = transaction.objectStore(Store.Keyval).get("preferences");
                    })
                    .then(() => {
                        send_response(request.result);
                    })
                    break;

                case MsgMethod.Update:
                    new IDB().open([Store.Keyval], "readwrite", transaction => {
                        transaction.objectStore(Store.Keyval).put(req.args, "preferences");
                    })
                    .then(() => {
                        send_response(true);
                    })
                    break;

                default:
                    send_response(null);
            }
            break;

        // Following
        case MsgObject.Follows:
        
            switch(req.method) {
                case MsgMethod.Read:
                    let request: IDBRequest;
                    new IDB().open([Store.Follows], "readonly", transaction => {
                        request = transaction.objectStore(Store.Follows).getAll();
                    })
                    .then(() => {
                        let list = request.result;
                        send_response(list);
                    })
                    break;

                case MsgMethod.Create:
                    new IDB().open([Store.Follows], "readwrite", transaction => {
                        transaction.objectStore(Store.Follows).add(req.args);
                    })
                    .then(() => {
                        if (chrome.alarms) {
                            chrome.alarms.create(req.args.name, {periodInMinutes: req.args.request_interval});
                        }
                        send_response(true);
                    })
                    break;

                case MsgMethod.Update:
                    new IDB().open([Store.Follows], "readwrite", transaction => {
                        transaction.objectStore(Store.Follows).put(req.args);
                    })
                    .then(() => {
                        send_response(true);
                    })
                    break;

                case MsgMethod.Delete:
                    new IDB().open([Store.Follows], "readwrite", transaction => {
                        transaction.objectStore(Store.Follows).delete(req.args.name);
                    })
                    .then(() => {
                        if (chrome.alarms) {
                            chrome.alarms.clear(req.args.name);
                        }
                        send_response(true);
                    })
                    break;

                default:
                    send_response(null);
            }
            break;
            
        // Errors
        case MsgObject.Errors:
            switch(req.method) {
                case MsgMethod.Read:
                    let request: IDBRequest;
                    new IDB().open([Store.ErrorLog], "readwrite", transaction => {
                        request = transaction.objectStore(Store.ErrorLog).getAll();
                    })
                    .then(() => {
                        let list = request.result;
                        send_response(list);
                    })
                    break;

                case MsgMethod.Create:
                    new IDB().open([Store.ErrorLog], "readwrite", transaction => {
                        transaction.objectStore(Store.ErrorLog).add(req.args);
                    })
                    .then(() => {
                        send_response(true)
                    })
                    break;

                case MsgMethod.Delete:
                    send_response(false);
                    break;

                default:
                    send_response(null);
            }
            break;
            
        // Saved queries
        case MsgObject.SavedQueries:

            switch(req.method) {
                case MsgMethod.Read:
                    let request: IDBRequest;
                    new IDB().open([Store.SavedQueries], "readonly", transaction => {
                        request = transaction.objectStore(Store.SavedQueries).getAll();
                    })
                    .then(() => {
                        let list = request.result;
                        send_response(list);
                    })
                    break;

                case MsgMethod.Create:
                    new IDB().open([Store.SavedQueries], "readwrite", transaction => {
                        transaction.objectStore(Store.SavedQueries).add(req.args);
                    })
                    .then(() => {
                        send_response(true)
                    })
                    break;

                case MsgMethod.Update:
                    new IDB().open([Store.SavedQueries], "readwrite", transaction => {
                        transaction.objectStore(Store.SavedQueries).put(req.args);
                    })
                    .then(() => {
                        send_response(true)
                    })
                    break;

                default:
                    send_response(null);
            }
            break;

        // Tags
        case MsgObject.Tags:

            switch(req.method) {
                case MsgMethod.Read:
                    if (req.args && req.args.query) {
                        search_tags(req.args.query)
                            .then(resp => {
                                let results = resp
                                    .sort((a, b) => b.score > a.score ? 1 : a.score > b.score ? -1 : 0)
                                    .map(item => item.data)

                                send_response(results);
                            })
                    } else {
                        let request: IDBRequest;
                        new IDB().open([Store.Tags], "readonly", transaction => {
                            request = transaction.objectStore(Store.Tags).getAll();
                        })
                        .then(() => {
                            let list = request.result;
                            send_response(list);
                        })
                    }
                    break;

                case MsgMethod.Update:
                    new IDB().open([Store.Tags], "readwrite", transaction => {
                        let tag = index_tag(req.args);
                        transaction.objectStore(Store.Tags).put(tag);
                    })
                    .then(() => {
                        send_response(true)
                    })
                    break;

                default:
                    send_response(null);
            }
            break;

        
        // Sources
        case MsgObject.Sources:

            switch(req.method) {
                case MsgMethod.Read:
                    if (req.args && req.args.query) {
                        search_directory(req.args.query)
                            .then(resp => {
                                let results = resp
                                    .sort((a, b) => b.score > a.score ? 1 : a.score > b.score ? -1 : 0)
                                    .map(item => item.data)

                                send_response(results);
                            })
                    } else if (req.args && req.args.id) {
                        let request: IDBRequest;
                        new IDB().open([Store.Directory], "readonly", transaction => {
                            request = transaction.objectStore(Store.Directory).get([req.args.id.key, req.args.id.directory_key]);
                        })
                        .then(() => {
                            let source = request.result;
                            send_response(source);
                        })
                    } else {
                        let request: IDBRequest;
                        new IDB().open([Store.Directory], "readonly", transaction => {
                            request = transaction.objectStore(Store.Directory).getAll();
                        })
                        .then(() => {
                            let list = request.result;
                            send_response(list);
                        })
                    }
                    break;

                case MsgMethod.Create:
                    new IDB().open([Store.Directory], "readwrite", transaction => {
                        let source = index_source(req.args);
                        transaction.objectStore(Store.Directory).add(source);
                    })
                    .then(() => {
                        send_response(true)
                    })
                    break;

                case MsgMethod.Update:
                    new IDB().open([Store.Directory], "readwrite", transaction => {
                        let source = index_source(req.args);
                        transaction.objectStore(Store.Directory).put(source);
                    })
                    .then(() => {
                        send_response(true)
                    })
                    break;

                default:
                    send_response(null);
            }
            break;

        default:
            send_response(false);
    }

    return true;
})

chrome.runtime.onConnect.addListener(port => {
    // query
    port.onMessage.addListener((msg: PortMessage) => {
        let query = (<Query>msg.args);

        if (msg.object === PortObject.Query) {
            let list_req: IDBRequest;
            let keyval_req: IDBRequest;
            new IDB().open([Store.Directory, Store.Keyval], "readonly", transaction => {
                list_req = transaction.objectStore(Store.Directory).getAll();
                keyval_req = transaction.objectStore(Store.Keyval).get("preferences");
            })
            .then(() => {
    
                let prefs = keyval_req.result;
                let should_log = prefs.log_queries;
                if (should_log && port.sender && port.sender.tab) {
                    // If we're planning on logging, make sure the thing sending a query isn't an incognito tab.
                    should_log = !port.sender.tab.incognito;
                }
    
                let list = (<Array<Source>>list_req.result);
    
                query = query_dsl(query, list);
    
                // Check each redirect key for a hit.
                if (query.options.redirect) {
                    let redirect_hit = list.find((source: Source): boolean => source.id.key === query.options.redirect!.key
                        && source.id.directory_key === query.options.redirect!.directory_key
                    );
    
                    if (redirect_hit && redirect_hit.forward_to) {
                        let url: string;
    
                        if (redirect_hit.homepage && !redirect_hit.forward_to) {
                            url = redirect_hit.homepage;
                        } else {
                            let data = resolve_parameter(redirect_hit.forward_to, query.fields);
                            url = build_url(<URLData>data);
                        }
    
                        port.postMessage({
                            redirect: {
                                to: redirect_hit,
                                url: url
                            },
                            list: [],
                            details: [],
                            is_completed: true,
                            request_build_time: 0,
                            search_time: 0
                        })
                        return;
                    }
                }
    
                // Custom implementation of query_yielders for the Directory meta source.
                function add_custom_query_yielders(results: Results): Results {
                    results.list.forEach(result => {
                        if (result.source && result.source.id.key === "directory" && result.mapping.metadata && result.mapping.metadata.mapping.source_id) {
                            result.yielded_queries = result.yielded_queries || [];
                            const source = list.find(item => item.id.key === (<TextOutput>result.mapping.metadata!.mapping.source_id).value);
    
                            if (source !== undefined) {
                                if (source.syndicate_from) {
                                    result.yielded_queries.push({
                                        name: `Syndicate from ${source.name}`,
                                        inputs: [{
                                            param: {
                                                kind: DataKind.Dynamic,
                                                type: DataType.Text,
                                                name: "phrase", // @TODO: use actual params from source
                                                is_required: true
                                            },
                                            source_mapping: []
                                        }],
                                        options: {
                                            include_ids: [source.id]
                                        }
                                    })
                                }
    
                                if (source.forward_to) {
                                    result.yielded_queries.push({
                                        name: `Search at ${source.name}`,
                                        inputs: [{
                                            param: {
                                                kind: DataKind.Dynamic,
                                                type: DataType.Text,
                                                name: "phrase",// @TODO: use actual params from source
                                                is_required: true
                                            },
                                            source_mapping: []
                                        }],
                                        options: {
                                            redirect: source.id
                                        }
                                    })
                                }
                            }
                            result.mapping.metadata = undefined;
                        }
                    })
                    return results;
                }
    
                // create pipeline functions from query.pipeline
    
                let {forwardables, queryables} = prepare_sources(query, list);
    
                search(<Query>query, queryables, [add_custom_query_yielders], (resp => port.postMessage(resp)))
                    .then(resp => {
                        resp.elsewhere = forwardables;
                        port.postMessage(resp);
                    })
                    .catch((err) => {
                        // @TODO: log error
                    })
            })

        } else if (msg.object === PortObject.FollowQuery) {
            follow_query(msg.args).then(() => {
                let follows_req: IDBRequest;
                new IDB().open([Store.Follows], "readonly", transaction => {
                    follows_req = transaction.objectStore(Store.Follows).getAll();
                })
                .then(() => {
                    port.postMessage(follows_req.result);
                    port.disconnect();
                })
                .catch(() => {
                    port.disconnect();
                })
            })
        } else {
            // Playground stuff
            port.disconnect();
        }
    })
})



if (chrome.alarms) {
    chrome.alarms.onAlarm.addListener(alarm => {
        follow_query(alarm.name);
    })
}

function follow_query(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
        let list_req: IDBRequest;
        let follows_req: IDBRequest;
        new IDB().open([Store.Follows, Store.Directory], "readonly", transaction => {
            list_req = transaction.objectStore(Store.Directory).getAll();
            follows_req = transaction.objectStore(Store.Follows).get(name);
        })
        .then(() => {
            let list = list_req.result;
            let active = <Follow>follows_req.result;
    
            if (active !== undefined) {
                let {queryables} = prepare_sources(active.query, list);
    
                search(active.query, queryables, [], () => {})
                    .then((results: Results): Results => {
                        results.list = results.list.filter(result => {
                            return result.mapping.identifier === undefined || !active.unseen.some(seen_result => {
                                return seen_result.mapping.identifier !== undefined
                                    && (<TextData>result.mapping.identifier).value === seen_result.mapping.identifier.value;
                            })
                        })
                        return results;
                    })
                    .then((results: Results) => {
                        active.unseen = active.unseen.concat(results.list);
                        active.seen = active.seen.concat(results.list);
                        active.last_updated = Date.now();
                        new IDB().open([Store.Follows], "readwrite", transaction => {
                            transaction.objectStore(Store.Follows).put(active);
                        })
                        .then(resolve)
                        .catch(reject)
                    })
                    .catch(reject)
            } else {
                chrome.alarms.clear(name);
                reject();
            }
        })
        .catch(reject)
    })
}

window.onerror = console.log;

chrome.runtime.onInstalled.addListener(details => {

    // Fetch initial source list.
    fetch("/sources.json")
        .then(resp => resp.json())
        .then((sources: Array<RemoteSource>) => sources.map(s => remote_to_local(s, "local")))
        .then((sources: Array<Source>) => {

            // Open database to set all initial data.
            new IDB().open([Store.Directory, Store.Tags, Store.Follows, Store.SavedQueries, Store.Keyval], "readwrite", transaction => {

                // Set initial Preferences.
                transaction.objectStore(Store.Keyval).put(<Preferences>{
                    theme: "light",
                    layout: "",
                    pagination_type: "expanding",
                    directory_order: "by_usage",
                    browser_popup_queries: "current_tab",
                    browser_popup_forwards: "current_tab",
                    log_queries: true,
                
                    redirect_source_prefix: "@",
                    include_source_prefix: "+",
                    exclude_source_prefix: "-",
                    include_tag_prefix: "#",
                    exclude_tag_prefix: "!#",
                    directory_lists: [],
                    directory_lists_refresh_interval: 6000000,
                    default_request_timeout: 5000,
                    trigger_bonus: 1.5
                }, "preferences")
        
                sources.forEach(source => {
                    source = index_source(source);
                    transaction.objectStore(Store.Directory).put(source);
                })

                let tags = sources.reduce((acc: Array<Tag>, source) => {
                    source.tags.forEach(tag => {
                        let match = acc.find(tg => tg.text === tag.text);
                        if (match === undefined) {
                            acc.push({
                                type: ["default", "offline", "builtin"].includes(tag.text) ? "meta" :
                                      ["audio", "video", "comic", "blog"].includes(tag.text) ? "format" :
                                      "topic",
                                text: tag.text
                            });
                        }
                    })
                    return acc;
                }, [])

                tags.forEach(tag => {
                    tag = index_tag(tag);
                    transaction.objectStore(Store.Tags).put(tag);
                })

                let initial_follows: Array<Follow> = [{
                    name: "Webcomics",
                    query: {
                        fields: {},
                        source_specific: [],
                        options: {
                            include_tags: ["comic"]
                        },
                        pipeline: []
                    },
                    face: "List",
                    request_interval: 60,
                    unseen: [],
                    seen: []
                }, {
                    name: "Podcasts",
                    query: {
                        fields: {},
                        source_specific: [],
                        options: {
                            include_tags: ["audio"]
                        },
                        pipeline: []
                    },
                    face: "List",
                    request_interval: 60,
                    unseen: [],
                    seen: []
                }]

                initial_follows.forEach(follow => {
                    transaction.objectStore(Store.Follows).put(follow);

                    if (chrome.alarms) {
                        chrome.alarms.create(follow.name, {periodInMinutes: follow.request_interval});
                    }
                })

                let saved_queries: Array<SavedQuery> = [{
                    name: "Minneapolis weather",
                    query: {
                        fields: {},
                        source_specific: [],
                        options: {
                            include_ids: [{key: "metaweather", directory_key: "local"}]
                        },
                        pipeline: []
                    },
                    face: "List"
                }, {
                    name: "Wikipedia: Main Page",
                    query: {
                        fields: {},
                        source_specific: [],
                        options: {
                            include_ids: [{key: "En-wiki-mainpage", directory_key: "local"}]
                        },
                        pipeline: []
                    },
                    face: "List"
                }, {
                    name: "xkcd",
                    query: {
                        fields: {},
                        source_specific: [],
                        options: {
                            include_ids: [{key: "xkcd", directory_key: "local"}]
                        },
                        pipeline: []
                    },
                    face: "List"
                }]

                saved_queries.forEach(saved_query => {
                    transaction.objectStore(Store.SavedQueries).put(saved_query);
                })
            })
            .catch(console.log)

        })
        .catch(console.log)


    /**
     * pre launch:
     *  - nicer thumbnail
     * 
     * post launch:
     *  - make source editor page work
     *  - result transformation/filtering/aggregating
     *  - separate popup page
     *  - show more query details on layout-level queryform
     *  - grid and graph result faces
     *  - api/data playground
     *  - caching at various points of the search pipeline (this is sort of a half-blocker on result transformation/filtering/aggregating stuff)
     *  - typesafe communication between frontend and backend
     *  - tag editor page
     *  - on tag detail page, use relevant query fields
     */
})


// @TODO sort by field given in Query.sort_by. Should the query be passed into post_processors as well?
/*function sort_and_dedupe(results: Results): Results {
    let new_list = results.list.sort((a, b): number => b.score.value - a.score.value)

    // drop repeated results, moving lower scorers to higher scorer's matching_results list
    .reduce((acc: Array<Result>, result, index, array): Array<Result> => {
        if (result.fields.identifier === undefined) {
            return acc.concat(result);
        }

        let match = array.slice(0, index).find((inner_result, inner_index) => {
            return index !== inner_index // @TODO: check how to offset so as to not have to check this
                && inner_result.fields.identifier !== undefined
                && result.fields.identifier!.value === inner_result.fields.identifier.value;
        });

        if (match !== undefined) {
            // Result and Match are the same, and match scores 
            // higher; put Result into Match's matching_results.
            // @NOTE: does this work right?
            match.matching_results = match.matching_results.concat(
                result.matching_results,
                result
            )
            return acc;
        } else {
            return acc.concat(result);
        }
    }, []);

    results.list = new_list;
    return results;
}*/
