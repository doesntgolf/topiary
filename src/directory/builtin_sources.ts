import {RemoteSource, DataKind, DataType, Format, Protocol} from "../schema";

let source_list: Array<RemoteSource> = [{
    key: "history",
    name: "History",
    keys: ["h", "history"],
    tags: ["default", "builtin", "offline"],
    related_sources: [],
    syndicate_from: {
        triggers: [],
        format: Format.JSON,
        parser: {
            kind: DataKind.Dynamic,
            type: DataType.List,
            result_parser: {
                type: DataType.Mapping,
                mapping: {
                    title: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "title"
                    },
                    link: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "url"
                    }
                }
            }
        },
        api: {
            protocol: Protocol.BrowserHistory,
            input: {
                type: DataType.Text,
                kind: DataKind.Dynamic,
                name: "phrase",
                is_required: true
            }
        }
    }
}, {
    key: "bookmarks",
    name: "Bookmarks",
    keys: ["bm", "bookmarks"],
    tags: ["default", "builtin", "offline"],
    related_sources: [],
    syndicate_from: {
        triggers: [],
        format: Format.JSON,
        parser: {
            kind: DataKind.Dynamic,
            type: DataType.List,
            result_parser: {
                type: DataType.Mapping,
                mapping: {
                    title: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "title"
                    },
                    link: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "url"
                    },
                    identifier: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "url"
                    }
                }
            }
        },
        api: {
            protocol: Protocol.BrowserBookmarks,
            input: {
                type: DataType.Text,
                kind: DataKind.Dynamic,
                name: "phrase",
                is_required: true
            }
        }
    }
}, {
    key: "directory",
    name: "Directory",
    keys: ["d", "directory"],
    tags: ["default", "builtin", "offline"],
    related_sources: [],
    syndicate_from: {
        triggers: [],
        format: Format.JSON,
        parser: {
            kind: DataKind.Dynamic,
            type: DataType.List,
            result_parser: {
                kind: DataKind.Dynamic,
                type: DataType.Mapping,
                mapping: {
                    title: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "data.name"
                    },
                    score: {
                        kind: DataKind.Dynamic,
                        type: DataType.Number,
                        expression: "score",
                        range: {
                            low: 0,
                            high: 1
                        }
                    },
                    link: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "data.homepage"
                    },
                    description: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "data.description"
                    },
                    identifier: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "data.id.key"
                    },
                    metadata: {
                        kind: DataKind.Dynamic,
                        type: DataType.Mapping,
                        mapping: {
                            source_id: {
                                kind: DataKind.Dynamic,
                                type: DataType.Text,
                                expression: "data.id.key",
                            }
                        }
                    }
                }
            }
        },
        api: {
            protocol: Protocol.Directory,
            input: {
                type: DataType.Text,
                kind: DataKind.Dynamic,
                name: "phrase",
                is_required: true
            }
        }
    }
}, {
    key: "query_stats",
    name: "Query Statistics",
    description: "Yo dawg...",
    keys: ["stats", "queries"],
    tags: ["builtin", "offline"],
    related_sources: [],
    syndicate_from: {
        triggers: [],
        format: Format.JSON,
        parser: {
            kind: DataKind.Dynamic,
            type: DataType.Mapping,
            mapping: {},
        },
        api: {
            protocol: Protocol.Directory,
            input: {
                type: DataType.Text,
                kind: DataKind.Dynamic,
                name: "phrase",
                is_required: true
            }
        }
    }
}, {
    key: "uploaded_data",
    name: "Uploaded data",
    description: "Yo dawg...",
    keys: ["stats", "queries"],
    tags: ["builtin", "offline"],
    related_sources: [],
    syndicate_from: {
        triggers: [],
        format: Format.JSON,
        parser: {
            kind: DataKind.Dynamic,
            type: DataType.Mapping,
            mapping: {},
        },
        api: {
            protocol: Protocol.UploadedData,
            input: {
                type: DataType.Text,
                kind: DataKind.Dynamic,
                name: "phrase",
                is_required: true
            }
        }
    }
}, {
    key: "xkcd",
    name: "xkcd",
    keys: ["xkcd"],
    tags: ["comic"],
    related_sources: [],
    homepage: "https://xkcd.com",
    syndicate_from: {
        triggers: [],
        format: Format.XML,
        parser: {
            kind: DataKind.Dynamic,
            type: DataType.List,
            expression: "//rss/channel/item",
            
            result_parser: {
                kind: DataKind.Dynamic,
                type: DataType.Mapping,
                mapping: {
                    title: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "title"
                    },
                    date: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "pubDate"
                    },
                    link: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "link"
                    },
                    html: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "description"
                    }
                }
            }
        },
        api: {
            protocol: Protocol.HTTP,
            input: {
                name: "API",
                type: DataType.Mapping,
                mapping: {
                    method: {
                        name: "Method",
                        kind: DataKind.Static,
                        type: DataType.Text,
                        is_required: true,
                        value: "GET"
                    },
                    url: {
                        type: DataType.Mapping,
                        mapping: {
                            root: {
                                name: "Root",
                                kind: DataKind.Static,
                                type: DataType.Text,
                                is_required: true,
                                value: "https://xkcd.com/rss.xml"
                            }
                        }
                    }
                }
            }
        }
    }
}, {
    key: "99pi_podcast",
    name: "99% Invisible",
    keys: [],
    tags: ["audio"],
    related_sources: [],
    homepage: "https://99percentinvisible.org/",
    syndicate_from: {
        triggers: [],
        format: Format.XML,
        parser: {
            kind: DataKind.Dynamic,
            type: DataType.List,
            expression: "//rss/channel/item",
            
            result_parser: {
                kind: DataKind.Dynamic,
                type: DataType.Mapping,
                mapping: {
                    title: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "title"
                    },
                    date: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "pubDate"
                    },
                    link: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "link"
                    },
                    html: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "description"
                    },
                    audio_url: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "enclosure/@url"
                    }
                }
            }
        },

        api: {
            protocol: Protocol.HTTP,
            input: {
                name: "API",
                type: DataType.Mapping,
                mapping: {
                    method: {
                        name: "Method",
                        kind: DataKind.Static,
                        type: DataType.Text,
                        is_required: true,
                        value: "GET"
                    },
                    url: {
                        type: DataType.Mapping,
                        mapping: {
                            root: {
                                name: "Root",
                                kind: DataKind.Static,
                                type: DataType.Text,
                                is_required: true,
                                value: "http://feeds.99percentinvisible.org/99percentinvisible"
                            }
                        }
                    }
                }
            }
        }
    }
}, {
    key: "wikipedia",
    name: "English Wikipedia",
    keys: ["w", "wikipedia"],
    tags: ["default"],
    related_sources: [],
    homepage: "https://en.wikipedia.org",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://en.wikipedia.org/w/index.php"
            },
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "search": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            }
        }
    },
    syndicate_from: {
        triggers: [],
        format: Format.JSON,
        parser: {
            kind: DataKind.Dynamic,
            type: DataType.List,
            expression: "query.search",

            result_parser: {
                kind: DataKind.Dynamic,
                type: DataType.Mapping,
                mapping: {
                    title: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "title"
                    },
                    description: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "snippet",
                        match_markers: {begin: "<span class=\"searchmatch\">", end: "</span>"}
                    },
                    link: {
                        type: DataType.Template,
                        lookup: {
                            "page_id": {
                                kind: DataKind.Dynamic,
                                type: DataType.Text,
                                expression: "pageid"
                            }
                        },
                        template: "https://en.wikipedia.org/?curid={{ page_id }}"
                    }
                }
            }
        },
        api: {
            protocol: Protocol.HTTP,
            input: {
                name: "API",
                type: DataType.Mapping,
                mapping: {
                    method: {
                        name: "Method",
                        kind: DataKind.Static,
                        type: DataType.Text,
                        is_required: true,
                        value: "GET"
                    },
                    url: {
                        type: DataType.Mapping,
                        mapping: {
                            root: {
                                name: "Root",
                                kind: DataKind.Static,
                                type: DataType.Text,
                                is_required: true,
                                value: "https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&formatversion=2"
                            },
                            querystring: {
                                name: "Query parameters",
                                type: DataType.Mapping,
                                mapping: {
                                    "srsearch": {
                                        name: "phrase",
                                        kind: DataKind.Dynamic,
                                        type: DataType.Text,
                                        is_required: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}]

export {source_list};