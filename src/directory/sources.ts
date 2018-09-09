import {RemoteSource, Format, Query, DataKind, DataType, Protocol} from "../schema";

 /**
 * Initial directory
 *
 * syndicating wishlist:
 *  weather, recipes, scihub, internet archive, gitlab, bitbucket, mdn, mastodon
 */

 let source_list: Array<RemoteSource> = [{
    key: "xkcd",
    name: "xkcd",
    description: `xkcd, sometimes styled XKCD, is a webcomic created by American author Randall Munroe. The comic's tagline describes it as "A webcomic of romance, sarcasm, math, and language". Munroe states on the comic's website that the name of the comic is not an initialism but "just a word with no phonetic pronunciation".

    The subject matter of the comic varies from statements on life and love to mathematical, programming, and scientific in-jokes. Some strips feature simple humor or pop-culture references. Although it has a cast of stick figures, the comic occasionally features landscapes, graphs and charts, and intricate mathematical patterns such as fractals. New cartoons are added three times a week, on Mondays, Wednesdays, and Fridays. [via Wikipedia]`,
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
                    },
                    identifier: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "link"
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
    description: `99% Invisible is an independently produced radio show created by Roman Mars that focuses on design and architecture. It began as a collaborative project between San Francisco public radio station KALW and the American Institute of Architects in San Francisco. Versions of the show are distributed by PRX for broadcast by a number of radio stations, and as a podcast as part of the Radiotopia network.
    
    The show's name is taken from a quote by Buckminster Fuller: "Ninety-nine percent of who you are is invisible and untouchable." Its goal is to expose the unseen and overlooked aspects of design, architecture, and activity in the world. Each episode generally focuses on a single topic or specific example of design, often including interviews with architects, experts, or people who have been influenced by the design. [via Wikipedia]`,
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
                        expression: "enclosure[@type='audio/mpeg']/@url"
                    },
                    video_url: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "enclosure[@type='video/mp4']/@url"
                    },
                    identifier: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "link"
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
    description: `Wikipedia (/ˌwɪkɪˈpiːdiə/, /ˌwɪkiˈpiːdiə/ WIK-ih-PEE-dee-ə) is a multilingual, web-based, free encyclopedia based on a model of openly editable content. It is the largest and most popular general reference work on the Internet, and is one of the most popular websites by Alexa rank. It is owned and supported by the Wikimedia Foundation, a non-profit organization which operates on money it receives from donors.

    Wikipedia was launched on January 15, 2001, by Jimmy Wales and Larry Sanger. Sanger coined its name,[11][12] a blend of wiki and encyclopedia. Initially an English-language encyclopedia, versions in other languages were quickly developed. With 5,710,368 articles, the English Wikipedia is the largest of the more than 290 Wikipedia encyclopedias. Overall, Wikipedia comprises more than 40 million articles in 301 different languages and had 18 billion page views and nearly 500 million unique visitors each month as of February 2014. [via Wikipedia]`,
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
}, {
    key: "google",
    name: "Google",
    description: `Google Search, also referred to as Google Web Search or simply Google, is a web search engine developed by Google LLC. It is the most-used search engine on the World Wide Web, handling more than three billion searches each day. As of July 2018, it is the most used search engine worldwide across all platforms with 90.46% market share.

    The order of search results returned by Google is based, in part, on a priority rank system called "PageRank". Google Search also provides many different options for customized search, using symbols to include, exclude, specify or require certain search behavior, and offers specialized interactive experiences, such as flight status and package tracking, weather forecasts, currency, unit and time conversions, word definitions, and more.
    
    The main purpose of Google Search is to hunt for text in publicly accessible documents offered by web servers, as opposed to other data, such as images or data contained in databases. It was originally developed by Larry Page and Sergey Brin in 1997. [via Wikipedia]`,
    keys: ["g", "google"],
    homepage: "https://google.com",
    related_sources: [],
    tags: ["default"],
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://encrypted.google.com/search"
            },
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "q": {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        name: "phrase",
                        is_required: true
                    }
                }
            }
        }
    }
}, {
    key: "hn",
    name: "Hacker News",
    description: `Hacker News is a social news website focusing on computer science and entrepreneurship. It is run by Paul Graham's investment fund and startup incubator, Y Combinator. In general, content that can be submitted is defined as "anything that gratifies one's intellectual curiosity". [via Wikipedia]`,
    keys: ["hn"],
    tags: [],
    related_sources: [],
    homepage: "https://news.ycombinator.com",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://hn.algolia.com/"
            },
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "q": {
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
        triggers: [{
            term: "tech",
            type: "contains",
            case_sensitive: false,
            remove_from_phrase: false
        }, {
            term: "technology",
            type: "contains",
            case_sensitive: false,
            remove_from_phrase: false
        }, {
            term: "software",
            type: "contains",
            case_sensitive: false,
            remove_from_phrase: false
        }, {
            term: "computers",
            type: "contains",
            case_sensitive: false,
            remove_from_phrase: false
        }],
        format: Format.JSON,
        parser: {
            kind: DataKind.Dynamic,
            type: DataType.List,
            expression: "hits",
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
                        expression: "created_at"
                    },
                    link: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "url"
                    },
                    metadata: {
                        kind: DataKind.Dynamic,
                        type: DataType.Mapping,
                        mapping: {
                            number_of_comments: {
                                kind: DataKind.Dynamic,
                                type: DataType.Number,
                                expression: "num_comments"
                            },
                            comments_url: {
                                kind: DataKind.Dynamic,
                                type: DataType.Text,
                                expression: "objectID",
                                //template: "https://news.ycombinator.com/item?id=%s"
                            },
                            points: {
                                kind: DataKind.Dynamic,
                                type: DataType.Text,
                                expression: "points"
                            }
                        }
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
                                value: "http://hn.algolia.com/api/v1/search"
                            },
                            querystring: {
                                name: "Query parameters",
                                type: DataType.Mapping,
                                mapping: {
                                    "query": {
                                        name: "phrase",
                                        kind: DataKind.Dynamic,
                                        type: DataType.Text,
                                        is_required: true
                                    },
                                    "tags": {
                                        name: "tags",
                                        kind: DataKind.Static,
                                        type: DataType.Text,
                                        value: "(story,show_hn,ask_hn)",
                                        is_required: false
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}, {
    key: "stackoverflow",
    name: "Stack Overflow",
    description: `Stack Overflow is a privately held website, the flagship site of the Stack Exchange Network, created in 2008 by Jeff Atwood and Joel Spolsky. It was created to be a more open alternative to earlier question and answer sites such as Experts-Exchange. The name for the website was chosen by voting in April 2008 by readers of Coding Horror, Atwood's popular programming blog.

    It features questions and answers on a wide range of topics in computer programming.
    
    The website serves as a platform for users to ask and answer questions, and, through membership and active participation, to vote questions and answers up or down and edit questions and answers in a fashion similar to a wiki or Digg. Users of Stack Overflow can earn reputation points and "badges"; for example, a person is awarded 10 reputation points for receiving an "up" vote on an answer given to a question and 5 points for the "up" vote of a question, and can receive badges for their valued contributions, which represents a kind of gamification of the traditional Q&A site. Users unlock new privileges with an increase in reputation like the ability to vote, comment, and even edit other people's posts. All user-generated content is licensed under a Creative Commons Attribute-ShareAlike license. [via Wikipedia]`,
    keys: ["so", "stackoverflow"],
    tags: [],
    related_sources: [],
    homepage: "https://stackoverflow.com",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://stackoverflow.com/search"
            },
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "q": {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        name: "phrase",
                        is_required: true
                    }
                }
            }
        }
    },
    syndicate_from: {
        triggers: [{
            term: "javascript",
            type: "contains",
            case_sensitive: false,
            remove_from_phrase: false
        }],
        format: Format.JSON,
        parser: {
            kind: DataKind.Dynamic,
            type: DataType.List,

            expression: "items",
            result_parser: {
                kind: DataKind.Dynamic,
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
                        expression: "link"
                    },
                    metadata: {
                        kind: DataKind.Dynamic,
                        type: DataType.Mapping,
                        mapping: {
                            tags: {
                                kind: DataKind.Dynamic,
                                type: DataType.Text,
                                expression: "tags"
                            },
                            answers: {
                                kind: DataKind.Dynamic,
                                type: DataType.Number,
                                expression: "answer_count"
                            },
                            score: {
                                kind: DataKind.Dynamic,
                                type: DataType.Number,
                                expression: "score"
                            } // note: this isn't a search result score -- it's SO's question score
                        }
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
                                value: "https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=relevance&site=stackoverflow"
                            },
                            querystring: {
                                name: "Query parameters",
                                type: DataType.Mapping,
                                mapping: {
                                    "q": {
                                        name: "phrase",
                                        kind: DataKind.Dynamic,
                                        type: DataType.Text,
                                        is_required: true
                                    },
                                    "tagged": {
                                        name: "tags",
                                        description: "semi-colon delimited list of tags",
                                        kind: DataKind.Dynamic,
                                        type: DataType.Text,
                                        is_required: false
                                    },
                                    "nottagged": {
                                        name: "nottags",
                                        description: "semi-colon delimited list of tags that aren't in the question",
                                        kind: DataKind.Dynamic,
                                        type: DataType.Text,
                                        is_required: false
                                    },
                                    "accepted": {
                                        name: "accepted",
                                        description: "true to return only questions with accepted answers, false to return only those without. Omit to elide constraint.",
                                        kind: DataKind.Dynamic,
                                        type: DataType.Text,
                                        is_required: false,
                                        options: [{
                                            label: "true",
                                            value: "true"
                                        }, {
                                            label: "false",
                                            value: "false"
                                        }]
                                    },
                                    "answers": {
                                        name: "answers",
                                        description: "the minimum number of answers returned questions must have.",
                                        kind: DataKind.Dynamic,
                                        type: DataType.Text,
                                        is_required: false
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}, {
    key: "github",
    name: "GitHub",
    description: `GitHub Inc. is a web-based hosting service for version control using Git. It is mostly used for computer code. It offers all of the distributed version control and source code management (SCM) functionality of Git as well as adding its own features. It provides access control and several collaboration features such as bug tracking, feature requests, task management, and wikis for every project.

    GitHub offers plans for both private repositories and free accounts which are commonly used to host open-source software projects. As of June 2018, GitHub reports having over 28 million users and 57 million repositories (including 28 million public repositories.), making it the largest host of source code in the world. [via Wikipedia]`,
    keys: ["github", "gh"],
    tags: ["software"],
    related_sources: [],
    homepage: "https://github.com",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "q": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    },
                    "type": {
                        name: "type",
                        options: [{label: "Code", value: "Code"}, {label: "Commits", value: "Commits"}, {label: "Issues", value: "Issues"}, {label: "Topics", value: "Topics"}, {label: "Wikis", value: "Wikis"}, {label: "Users", value: "Users"}],
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: false
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://github.com/search?utf8=✓"
            },
        }
    },
    syndicate_from: {
        triggers: [{
            term: "software",
            type: "contains",
            case_sensitive: false,
            remove_from_phrase: true
        }],
        format: Format.JSON,
        parser: {
            kind: DataKind.Dynamic,
            type: DataType.List,
            expression: "items",
            result_parser: {
                kind: DataKind.Dynamic,
                type: DataType.Mapping,
                mapping: {
                    score: {
                        kind: DataKind.Dynamic,
                        type: DataType.Number,
                        range: {low: 0, high: 100},
                        expression: "score"
                    },
                    title: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "name"
                    },
                    description: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "description"
                    },
                    link: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "html_url"
                    },
                    date: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "pushed_at"
                    },
                    metadata: {
                        type: DataType.Mapping,
                        kind: DataKind.Dynamic,
                        mapping: {
                            language: {
                                kind: DataKind.Dynamic,
                                type: DataType.Text,
                                expression: "language"
                            },
                            stargazers: {
                                kind: DataKind.Dynamic,
                                type: DataType.Number,
                                expression: "stargazers_count"
                            },
                            watchers: {
                                kind: DataKind.Dynamic,
                                type: DataType.Number,
                                expression: "watchers_count"
                            },
                            forks: {
                                kind: DataKind.Dynamic,
                                type: DataType.Number,
                                expression: "forks_count"
                            },
                            open_issues: {
                                kind: DataKind.Dynamic,
                                type: DataType.Number,
                                expression: "open_issues_count"
                            }
                        }
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
                    headers: {
                        name: "Headers",
                        type: DataType.Mapping,
                        mapping: {
                            "Accept": {
                                name: "accept",
                                is_required: true,
                                kind: DataKind.Static,
                                type: DataType.Text,
                                value: "application/vnd.github.v3.text-match+json"
                            }
                        }
                    },
                    url: {
                        type: DataType.Mapping,
                        mapping: {
                            root: {
                                name: "Root",
                                kind: DataKind.Static,
                                type: DataType.Text,
                                is_required: true,
                                value: "https://api.github.com/search/repositories"
                            },
                            querystring: {
                                name: "Query parameters",
                                type: DataType.Mapping,
                                mapping: {
                                    "q": {
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
}, {
    key: "En-wiki-mainpage",
    name: "English Wikipedia Main Page",
    description: "The Main Page of English Wikipedia.",
    tags: [],
    related_sources: [],
    keys: [],
    homepage: "https://en.wikipedia.org/wiki/Main_Page",
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
                        kind: DataKind.Static,
                        type: DataType.Text,
                        value: "The Main Page of English Wikipedia"
                    },
                    link: {
                        kind: DataKind.Static,
                        type: DataType.Text,
                        value: "https://en.wikipedia.org/wiki/Main_Page"
                    },
                    html: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "parse.text.*"
                    },
                    identifier: {
                        kind: DataKind.Static,
                        type: DataType.Number,
                        value: 1
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
                                value: "https://en.wikipedia.org/w/api.php?action=parse&format=json&page=Main_Page"
                            }
                        }
                    }
                }
            }
        }
    }
}, {
    key: "existential_comics",
    name: "Existential Comics",
    description: `Existential Comics is a webcomic about philosophy created by Corey Mohler. Mohler, who has an amateur interest in the subject rather than an academic background, created it in December 2013 in an attempt to help popularize philosophy through comedy. The comic tends to depict philosophers of different backgrounds and has them interact and argue with each other. It also gives textual descriptions of the jokes and associated philosophy to help educate readers. [via Wikipedia]`,
    keys: [],
    tags: ["comic"],
    related_sources: [],
    homepage: "https://existentialcomics.com/",
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
                    identifier: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "link"
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
                                value: "https://existentialcomics.com/rss.xml"
                            }
                        }
                    }
                }
            }
        }
    }
}, {
    key: "dinosaur_comics",
    name: "Dinosaur Comics",
    description: `Dinosaur Comics is a constrained webcomic by Canadian writer Ryan North. It is also known as "Qwantz", after the site's domain name, "qwantz.com". The first comic was posted on February 1, 2003, although there were earlier prototypes. Dinosaur Comics has also been printed in three collections and in a number of newspapers. The comic centers on three main characters, T-Rex, Utahraptor and Dromiceiomimus.

    Comics are posted every Monday, Wednesday, and Friday. Every strip uses the same artwork and panel layout; only the dialogue changes from day to day. There are occasional deviations from this principle, including a number of episodic comics.[6] North created the comic because it was something he'd "long wanted to do but couldn’t figure out how to accomplish... [he doesn't] draw, so working in a visual medium like comics isn’t the easiest thing to stumble into." [via Wikipedia]`,
    keys: [],
    tags: ["comic"],
    related_sources: [],
    homepage: "https://www.qwantz.com/",
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
                    identifier: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "link"
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
                                value: "https://qwantz.com/rssfeed.php"
                            }
                        }
                    }
                }
            }
        }
    }
}, {
    key: "smbc_comics",
    name: "Saturday Morning Breakfast Cereal",
    description: `Saturday Morning Breakfast Cereal (SMBC) is a webcomic by Zach Weinersmith. It features few recurring characters or storylines, and has no set format; some strips may be a single panel, while others may go on for ten panels or more. Recurring themes in SMBC include atheism, God, superheroes, romance, dating, science, research, parenting and the meaning of life. SMBC is published daily. [via Wikipedia]`,
    keys: [],
    tags: ["comic"],
    related_sources: [],
    homepage: "https://www.smbc-comics.com/",
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
                    identifier: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "link"
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
                                value: "https://www.smbc-comics.com/comic/rss"
                            }
                        }
                    }
                }
            }
        }
    }
}, {
    key: "radiolab_podcast",
    name: "Radiolab",
    description: `Radiolab is a radio program produced by WNYC, a public radio station in New York City, and broadcast on public radio stations in the United States. The show is nationally syndicated and is available as a podcast. In 2008, live shows were first offered.

    Hosted by Jad Abumrad and Robert Krulwich, the show focuses on topics of a scientific and philosophical nature. The show attempts to approach broad, difficult topics such as "time" and "morality" in an accessible and light-hearted manner and with a distinctive audio production style. [via Wikipedia]`,
    keys: [],
    tags: ["audio"],
    related_sources: [],
    homepage: "https://www.wnycstudios.org/shows/radiolab/",
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
                    },
                    identifier: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "link"
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
                                value: "https://www.wnycstudios.org/feeds/shows/radiolab"
                            }
                        }
                    }
                }
            }
        }
    }
}, {
    key: "hardcore_history_podcast",
    name: "Hardcore History",
    description: `Hardcore History is a podcast hosted by Dan Carlin for exploring topics throughout world history. The focus of each episode varies widely from show to show but they are generally centered on specific historical events and are discussed in a "theater of the mind" style. New episodes are released approximately every four to seven months. [via Wikipedia]`,
    keys: [],
    tags: ["audio"],
    related_sources: [],
    homepage: "https://www.dancarlin.com/hardcore-history-series/",
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
                    },
                    identifier: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "link"
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
                                value: "http://feeds.feedburner.com/dancarlin/history?format=xml"
                            }
                        }
                    }
                }
            }
        }
    }
}, {
    key: "mdn",
    name: "MDN Web Docs",
    description: `Mozilla Developer Network is a resource for developers, maintained by the community of developers and technical writers and hosting many documents on a wide variety of subjects, such as: HTML5, JavaScript, CSS, Web APIs, Node.js, WebExtensions and MathML. For mobile web developers, MDN provides documentation on subjects such as building a HTML5 mobile app, building a mobile add-on, and location-aware apps. [via Wikipedia]`,
    keys: ["mdn"],
    tags: ["dev"],
    related_sources: [],
    homepage: "https://developer.mozilla.org",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "q": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://developer.mozilla.org/search"
            },
        }
    }
}, {
    key: "reddit",
    name: "Reddit",
    description: `Reddit (/ˈrɛdɪt/, stylized in its logo as reddit) is an American social news aggregation, web content rating, and discussion website. Registered members submit content to the site such as links, text posts, and images, which are then voted up or down by other members. Posts are organized by subject into user-created boards called "subreddits", which cover a variety of topics including news, science, movies, video games, music, books, fitness, food, and image-sharing. Submissions with more up-votes appear towards the top of their subreddit and, if they receive enough votes, ultimately on the site's front page. [via Wikipedia]`,
    keys: ["r", "reddit"],
    tags: ["forum"],
    related_sources: [],
    homepage: "https://www.reddit.com",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "q": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://www.reddit.com/search"
            },
        }
    }
}, {
    key: "hubski",
    name: "Hubski",
    description: `Hubski is a social networking and discussion site. In addition to sharing content from around the web, users are encouraged to share their own original content. [via Wikipedia]`,
    keys: ["hubski"],
    tags: ["forum"],
    related_sources: [],
    homepage: "https://hubski.com",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "q": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://hubski.com/search"
            },
        }
    }
}, {
    key: "googlemaps",
    name: "Google Maps",
    description: `Google Maps is a web mapping service developed by Google. It offers satellite imagery, street maps, 360° panoramic views of streets (Street View), real-time traffic conditions (Google Traffic), and route planning for traveling by foot, car, bicycle (in beta), or public transportation.`,
    keys: ["gm", "googlemaps", "gmaps"],
    tags: ["map"],
    related_sources: [],
    homepage: "https://www.google.com/maps",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "q": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://www.google.com/maps"
            },
        }
    }
}, {
    key: "googlescholar",
    name: "Google Scholar",
    description: `Google Scholar is a freely accessible web search engine that indexes the full text or metadata of scholarly literature across an array of publishing formats and disciplines. The Google Scholar index includes most peer-reviewed online academic journals and books, conference papers, theses and dissertations, preprints, abstracts, technical reports, and other scholarly literature, including court opinions and patents. While Google does not publish the size of Google Scholar's database, third-party researchers estimated it to contain roughly 160 million documents as of May 2014 and an earlier statistical estimate published in PLOS ONE using a Mark and recapture method estimated approximately 80–90% coverage of all articles published in English with an estimate of 100 million. [via Wikipedia]`,
    keys: ["gs", "scholar", "googlescholar", "gscholar"],
    tags: [],
    related_sources: [],
    homepage: "https://scholar.google.com/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "q": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://scholar.google.com/scholar"
            },
        }
    }
}, {
    key: "openstreetmap",
    name: "OpenStreetMap",
    description: `OpenStreetMap (OSM) is a collaborative project to create a free editable map of the world. Rather than the map itself, the data generated by the project is considered its primary output. The creation and growth of OSM has been motivated by restrictions on use or availability of map information across much of the world, and the advent of inexpensive portable satellite navigation devices.[6] OSM is considered a prominent example of volunteered geographic information. [via Wikipedia]`,
    keys: ["openstreetmap", "osm", "map", "maps"],
    tags: ["map"],
    related_sources: [],
    homepage: "https://www.openstreetmap.org",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "query": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://www.openstreetmap.org/search"
            },
        }
    }
}, {
    key: "medium",
    name: "Medium",
    description: `Medium is an online publishing platform developed by Evan Williams, and launched in August 2012. It is owned by A Medium Corporation. The platform is an example of social journalism, having a hybrid collection of amateur and professional people and publications, or exclusive blogs or publishers on Medium, and is regularly regarded as a blog host. [via Wikipedia]`,
    keys: ["medium"],
    tags: ["blog"],
    related_sources: [],
    homepage: "https://medium.com",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "q": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://medium.com/search"
            },
        }
    }
}, {
    key: "twitter",
    name: "Twitter",
    keys: ["twitter", "tweet", "tweets"],
    tags: [],
    related_sources: [],
    homepage: "https://twitter.com",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "q": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://twitter.com/search"
            },
        }
    }
}, {
    key: "facebook",
    name: "Facebook",
    keys: ["fb", "facebook"],
    tags: [],
    related_sources: [],
    homepage: "https://facebook.com",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "p": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: { // @TODO: make template parameter
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://www.facebook.com/search/str/{{query}}/keywords_search"
            }
        }
    }
}, {
    key: "yahoo",
    name: "Yahoo",
    keys: ["yahoo"],
    tags: [],
    related_sources: [],
    homepage: "https://www.yahoo.com",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "p": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://search.yahoo.com/search"
            }
        }
    }
}, {
    key: "bing",
    name: "Bing",
    keys: ["b", "bing"],
    tags: ["default"],
    related_sources: [],
    homepage: "https://www.bing.com",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "q": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://www.bing.com/search"
            },
        }
    }
}, {
    key: "duckduckgo",
    name: "DuckDuckGo",
    keys: ["d", "ddg", "duck", "duckduckgo"],
    tags: ["default"],
    related_sources: [],
    homepage: "https://duckduckgo.com/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "q": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://duckduckgo.com/"
            },
        }
    }
}, {
    key: "linkedin",
    name: "LinkedIn",
    related_sources: [],
    keys: ["linked", "linkedin"],
    tags: [],
    homepage: "https://www.linkedin.com/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "keywords": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://www.linkedin.com/search/results/index/"
            },
        }
    }
}, {
    key: "imgur",
    name: "imgur",
    related_sources: [],
    keys: ["imgur"],
    tags: [],
    homepage: "https://imgur.com/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "q": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://imgur.com/search"
            },
        }
    }
}, {
    key: "youtube",
    name: "YouTube",
    related_sources: [],
    keys: ["yt", "youtube"],
    tags: ["video"],
    homepage: "https://www.youtube.com/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "search_query": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://www.youtube.com/results"
            },
        }
    }
}, {
    key: "amazon",
    name: "Amazon",
    related_sources: [],
    keys: ["a", "amazon"],
    tags: ["shopping"],
    homepage: "https://smile.amazon.com/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "field-keywords": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://smile.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps"
            },
        }
    }
}, {
    key: "ebay",
    name: "eBay",
    related_sources: [],
    keys: ["ebay"],
    tags: ["shopping"],
    homepage: "https://www.ebay.com/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "_nkw": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://www.ebay.com/sch/i.html?_from=R40&_trksid=m570.l1313&_sacat=0"
            },
        }
    }
}, {
    key: "twitch",
    name: "Twitch",
    related_sources: [],
    keys: ["twitch", "twitchtv"],
    tags: ["video"],
    homepage: "https://www.twitch.tv/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "query": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://www.twitch.tv/{{query}}"
            },
        }
    }
}, {
    key: "instagram",
    name: "Instagram",
    related_sources: [],
    keys: ["insta", "instagram"],
    tags: ["image"],
    homepage: "https://www.instagram.com/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "query": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://www.instagram.com/explore/tags/{{query}}/"
            },
        }
    }
}, {
    key: "flickr",
    name: "Flickr",
    related_sources: [],
    keys: ["flickr"],
    tags: ["image"],
    homepage: "https://www.flickr.com/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "text": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://www.flickr.com/search/"
            },
        }
    }
}, {
    key: "tumblr",
    name: "Tumblr",
    related_sources: [],
    keys: ["tumblr"],
    tags: ["blog"],
    homepage: "https://www.tumblr.com/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "query": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://www.tumblr.com/search/{{query}}"
            },
        }
    }
}, {
    key: "creativecommons",
    name: "Creative Commons",
    related_sources: [],
    keys: ["cc", "creativecommons"],
    tags: [],
    homepage: "https://creativecommons.org/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
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
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://ccsearch.creativecommons.org/?page=1&search_fields=title&search_fields=creator&search_fields=tags&per_page=20&work_types=photos&providers=500px&providers=flickr&work_types=cultural&providers=europeana&providers=met&providers=nypl&providers=rijksmuseum"
            },
        }
    }
}, {
    key: "freemusicarchive",
    name: "Free Music Archive",
    related_sources: [],
    keys: ["fma", "freemusicarchive"],
    tags: ["music", "audio"],
    homepage: "https://freemusicarchive.org/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "quicksearch": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://freemusicarchive.org/search/"
            },
        }
    }
}, {
    key: "internetarchive",
    name: "Internet Archive",
    related_sources: [],
    keys: ["ia", "internetarchive"],
    tags: [],
    homepage: "https://archive.org/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "query": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://archive.org/search.php"
            },
        }
    }
}, {
    key: "waybackmachine",
    name: "Wayback Machine",
    related_sources: [],
    keys: ["wm", "wayback", "waybackmachine"],
    tags: [],
    homepage: "https://web.archive.org/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "url": {
                        name: "url",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://web.archive.org/web/{{url}}"
            },
        }
    }
}, {
    key: "soundcloud",
    name: "SoundCloud",
    related_sources: [],
    keys: ["sc", "soundcloud"],
    tags: ["music", "audio"],
    homepage: "https://soundcloud.com/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "q": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://soundcloud.com/search"
            },
        }
    }
}, {
    key: "europeana",
    name: "Europeana",
    related_sources: [],
    keys: ["europeana"],
    tags: [],
    homepage: "https://www.europeana.eu/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "q": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://www.europeana.eu/portal/en/search"
            },
        }
    }
}, {
    key: "wikimediacommons",
    name: "Wikimedia Commons",
    related_sources: [],
    keys: ["wc", "commons", "wikimediacommons"],
    tags: [],
    homepage: "https://commons.wikimedia.org/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
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
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://commons.wikimedia.org/w/index.php?title=Special%3ASearch&fulltext=Search"
            },
        }
    }
}, {
    key: "googleimages",
    name: "Google Images",
    related_sources: [],
    keys: ["gi", "images", "googleimages"],
    tags: ["image"],
    homepage: "https://www.google.com/imghp",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "q": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://www.google.com/search?tbm=isch&tbs=imgo:1"
            },
        }
    }
}, {
    key: "bitbucket",
    name: "Bitbucket",
    related_sources: [],
    keys: ["bb", "bitbucket"],
    tags: ["software"],
    homepage: "https://bitbucket.org/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "name": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://bitbucket.org/repo/all/"
            },
        }
    }
}, {
    key: "gitlab",
    name: "GitLab",
    related_sources: [],
    keys: ["gitlab"],
    tags: ["software"],
    homepage: "https://about.gitlab.com/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
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
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://gitlab.com/search?utf8=✓"
            },
        }
    }
}, {
    key: "wolframalpha",
    name: "Wolfram Alpha",
    related_sources: [],
    keys: ["wolfram", "wolframalpha"],
    tags: [],
    homepage: "https://www.wolframalpha.com/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "i": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://www.wolframalpha.com/input/"
            },
        }
    }
}, {
    key: "netflix",
    name: "Netflix",
    related_sources: [],
    keys: ["netflix"],
    tags: ["video"],
    homepage: "https://www.netflix.com/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "query": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://www.netflix.com/search/{{query}}"
            },
        }
    }
}, {
    key: "imdb",
    name: "IMDb",
    related_sources: [],
    keys: ["imdb"],
    tags: [],
    homepage: "https://www.imdb.com/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "q": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "hhttps://www.imdb.com/find?ref_=nv_sr_fn&s=all"
            },
        }
    }
}, {
    key: "goodreads",
    name: "Goodreads",
    related_sources: [],
    keys: ["gr", "goodreads"],
    tags: ["books"],
    homepage: "https://www.goodreads.com/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "query": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://www.goodreads.com/search?utf8=✓"
            },
        }
    }
}, {
    key: "openlibrary",
    name: "OpenLibrary",
    related_sources: [],
    keys: ["openlibrary"],
    tags: ["books"],
    homepage: "https://openlibrary.org/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "q": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://openlibrary.org/search"
            },
        }
    }
}, {
    key: "googlebooks",
    name: "Google Books",
    related_sources: [],
    keys: ["gbooks", "googlebooks", "gb"],
    tags: ["books"],
    homepage: "https://books.google.com/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "q": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://www.google.com/search?tbm=bks"
            },
        }
    }
}, {
    key: "worldcat",
    name: "WorldCat",
    related_sources: [],
    keys: ["worldcat"],
    tags: ["books"],
    homepage: "https://www.worldcat.org/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "q": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://www.worldcat.org/search?qt=worldcat_org_all"
            },
        }
    }
}, {
    key: "gutenberg",
    name: "Project Gutenberg",
    related_sources: [],
    keys: ["gutenberg", "projectgutenberg"],
    tags: ["books"],
    homepage: "https://www.gutenberg.org/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "query": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://www.gutenberg.org/ebooks/search/"
            },
        }
    }
}, {
    key: "englishwiktionary",
    name: "English Wiktionary",
    related_sources: [],
    keys: ["wiktionary", "dictionary", "thesaurus", "etymology", "word", "words"],
    tags: ["books"],
    homepage: "https://en.wiktionary.org/wiki/Wiktionary:Main_Page",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
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
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://en.wiktionary.org/w/index.php?title=Special%3ASearch&fulltext=Search"
            },
        }
    }
}, {
    key: "englishwikiquote",
    name: "English Wikiquote",
    related_sources: [],
    keys: ["wikiquote", "quote", "quotes"],
    tags: [],
    homepage: "https://en.wikiquote.org/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
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
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://en.wikiquote.org/wiki/Special:Search?go=Go"
            },
        }
    }
}, {
    key: "englishwikibooks",
    name: "English Wikibooks",
    related_sources: [],
    keys: ["wikibooks"],
    tags: ["books"],
    homepage: "https://en.wikibooks.org/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
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
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://en.wikibooks.org/wiki/Special:Search?go=Go"
            },
        }
    }
}, {
    key: "wikispecies",
    name: "Wikispecies",
    related_sources: [],
    keys: ["wikispecies", "ws", "species", "animal", "animals", "plant", "plants"],
    tags: [],
    homepage: "https://species.wikimedia.org/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
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
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://species.wikimedia.org/w/index.php?title=Special%3ASearch&fulltext=Search"
            },
        }
    }
}, {
    key: "englishwikivoyage",
    name: "English Wikivoyage",
    related_sources: [],
    keys: ["wikivoyage"],
    tags: ["travel"],
    homepage: "https://en.wikivoyage.org/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
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
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://en.wikivoyage.org/wiki/Special:Search?go=Go"
            },
        }
    }
}, {
    key: "vimeo",
    name: "Vimeo",
    related_sources: [],
    keys: ["vimeo"],
    tags: ["video"],
    homepage: "https://vimeo.com/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "q": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://vimeo.com/search"
            },
        }
    }
}, {
    key: "gfycat",
    name: "gfycat",
    related_sources: [],
    keys: ["gfycat", "gif", "gifs"],
    tags: [],
    homepage: "https://gfycat.com/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "query": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://gfycat.com/gifs/search/{{query}}"
            },
        }
    }
}, {
    key: "unsplash",
    name: "Unsplash",
    related_sources: [],
    keys: ["unsplash"],
    tags: ["image"],
    homepage: "https://unsplash.com/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "query": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://unsplash.com/search/photos/{{query}}"
            },
        }
    }
}, {
    key: "500px",
    name: "500px",
    related_sources: [],
    keys: ["500", "500px"],
    tags: ["image"],
    homepage: "https://500px.com/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "q": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://500px.com/search?submit=Submit&type=photos"
            },
        }
    }
}, {
    key: "arxiv",
    name: "arXiv",
    related_sources: [],
    keys: ["arxiv"],
    tags: [],
    homepage: "https://arxiv.org/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "query": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "http://search.arxiv.org:8081/"
            },
        }
    }
}, {
    key: "biorxiv",
    name: "bioRxiv",
    related_sources: [],
    keys: ["biorxiv"],
    tags: [],
    homepage: "https://www.biorxiv.org/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "query": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://www.biorxiv.org/search/{{query}}"
            },
        }
    }
}, {
    key: "lobsters",
    name: "Lobsters",
    related_sources: [],
    keys: ["lobsters"],
    tags: ["forum"],
    homepage: "https://lobste.rs/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "q": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            },
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://lobste.rs/search?utf8=✓what=stories&order=relevance"
            },
        }
    }
}, {
    key: "wordpress.org",
    name: "Wordpress.org",
    related_sources: [],
    keys: ["wordpress"],
    tags: [],
    homepage: "https://wordpress.org/"
}, {
    key: "pinterest",
    name: "Pinterest",
    related_sources: [],
    keys: ["pinterest"],
    tags: [],
    homepage: "https://pinterest.com/"
}, {
    key: "wordpress.com",
    name: "Wordpress.com",
    related_sources: [],
    keys: [],
    tags: [],
    homepage: "https://wordpress.com/"
}, {
    key: "blogspot",
    name: "Blogspot",
    related_sources: [],
    keys: ["blogspot"],
    tags: [],
    homepage: "https://blogspot.com/"
}, {
    key: "apple",
    name: "Apple",
    related_sources: [],
    keys: ["apple"],
    tags: [],
    homepage: "https://apple.com/"
}, {
    key: "adobe",
    name: "Adobe",
    related_sources: [],
    keys: ["adobe"],
    tags: [],
    homepage: "https://adobe.com/"
}, {
    key: "microsoft",
    name: "Microsoft",
    related_sources: [],
    keys: ["microsoft"],
    tags: [],
    homepage: "https://microsoft.com/"
}, {
    key: "reuters",
    name: "Reuters",
    description: `Reuters (/ˈrɔɪtərz/) is an international news agency headquartered in London, United Kingdom. It is a division of Thomson Reuters. Until 2008, the Reuters news agency formed part of an independent company, Reuters Group plc, which was also a provider of financial market data. Since the acquisition of Reuters Group by the Thomson Corporation in 2008, the Reuters news agency has been a part of Thomson Reuters, making up the media division. Reuters transmits news in English, French, German, Italian, Spanish, Portuguese, Russian, Urdu, Arabic, Japanese, Korean, and Chinese. It was established in 1851. [via Wikipedia]`,
    related_sources: [],
    keys: ["reuters"],
    tags: ["news"],
    homepage: "https://reuters.com/",
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
                    identifier: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "link"
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
                                value: "http://feeds.reuters.com/reuters/topNews"
                            }
                        }
                    }
                }
            }
        }
    }
}, {
    key: "nyt",
    name: "New York Times Homepage",
    description: `Reuters (/ˈrɔɪtərz/) is an international news agency headquartered in London, United Kingdom. It is a division of Thomson Reuters. Until 2008, the Reuters news agency formed part of an independent company, Reuters Group plc, which was also a provider of financial market data. Since the acquisition of Reuters Group by the Thomson Corporation in 2008, the Reuters news agency has been a part of Thomson Reuters, making up the media division. Reuters transmits news in English, French, German, Italian, Spanish, Portuguese, Russian, Urdu, Arabic, Japanese, Korean, and Chinese. It was established in 1851. [via Wikipedia]`,
    related_sources: [],
    keys: ["nyt"],
    tags: ["news"],
    homepage: "https://www.nytimes.com/",
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
                    image_url: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "media:content/@url"
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
                    identifier: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "link"
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
                                value: "http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml"
                            }
                        }
                    }
                }
            }
        }
    }
}, {
    key: "quantamagazine",
    name: "Quanta Magazine",
    related_sources: [],
    keys: ["quanta"],
    tags: ["science"],
    homepage: "https://quantamagazine.org/",
    forward_to: {
        type: DataType.Mapping,
        mapping: {
            root: {
                name: "Root",
                kind: DataKind.Static,
                type: DataType.Text,
                is_required: true,
                value: "https://www.quantamagazine.org/search"
            },
            querystring: {
                name: "Query parameters",
                type: DataType.Mapping,
                mapping: {
                    "q[s]": {
                        name: "phrase",
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        is_required: true
                    }
                }
            }
        }
    },
    /*syndicate_from: {
        triggers: [],
        format: Format.JSON,
        parser: {
            kind: DataKind.Dynamic,
            type: DataType.List,
            expression: "data.response.data",
            result_parser: {
                kind: DataKind.Dynamic,
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
                        expression: "link"
                    },
                    identifier: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "link"
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
                        value: "POST"
                    },
                    body: {
                        name: "Body",
                        kind: DataKind.Dynamic,
                        type: DataType.Template,
                        is_required: true,
                        lookup: {
                            phrase: {
                                name: "phrase",
                                kind: DataKind.Dynamic,
                                type: DataType.Text,
                                is_required: true,
                                value: ""
                            }
                        },
                        template: `{"operationName":"getSearch","variables":{"args":"?q[s]={{phrase}}&page=1"},"query":"query getSearch($args: String) {\n  response: getSearch(args: $args) {\n    meta {\n      title\n      max_num_pages\n      found_posts\n      __typename\n    }\n    data {\n      ... on Post {\n        id\n        title\n        excerpt\n        link\n        slug\n        disqus\n        featured_media_image {\n          ...ImageFields\n          __typename\n        }\n        authors {\n          name\n          link\n          __typename\n        }\n        podcast {\n          url\n          feed\n          type\n          duration\n          __typename\n        }\n        acf {\n          featured_block_title\n          kicker {\n            name\n            link\n            __typename\n          }\n          featured_image_default {\n            ...ImageFields\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment ImageFields on Image {\n  alt\n  caption\n  url\n  width\n  height\n  sizes {\n    thumbnail\n    square_small\n    square_large\n    medium\n    medium_large\n    large\n    __typename\n  }\n  __typename\n}\n"}`
                    },
                    url: {
                        type: DataType.Mapping,
                        mapping: {
                            root: {
                                name: "Root",
                                kind: DataKind.Static,
                                type: DataType.Text,
                                is_required: true,
                                value: "https://www.quantamagazine.org/graphql"
                            }
                        }
                    }
                }
            }
        }
    }*/
}, {
    key: "metaweather",
    name: "MetaWeather",
    description: `MetaWeather is an automated weather data aggregator that takes the weather predictions from various forecasters and calculates the most likely outcome.`,
    related_sources: [],
    keys: ["weather"],
    tags: ["weather"],
    homepage: "https://www.metaweather.com/",
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
                        expression: "title"
                    },
                    metadata: {
                        kind: DataKind.Dynamic,
                        type: DataType.Mapping,
                        mapping: {
                            "Sun rise": {
                                kind: DataKind.Dynamic,
                                type: DataType.Text,
                                expression: "sun_rise"
                            },
                            "Sun set": {
                                kind: DataKind.Dynamic,
                                type: DataType.Text,
                                expression: "sun_set"
                            }
                        }
                    },
                    children: {
                        kind: DataKind.Dynamic,
                        type: DataType.List,
                        expression: "consolidated_weather",
                        result_parser: {
                            kind: DataKind.Dynamic,
                            type: DataType.Mapping,
                            mapping: {
                                "Date": {
                                    kind: DataKind.Dynamic,
                                    type: DataType.Number,
                                    expression: "applicable_date"
                                },
                                "Temperature": {
                                    kind: DataKind.Dynamic,
                                    type: DataType.Number,
                                    expression: "the_temp"
                                },
                                "Max temp": {
                                    kind: DataKind.Dynamic,
                                    type: DataType.Number,
                                    expression: "max_temp"
                                },
                                "Min temp": {
                                    kind: DataKind.Dynamic,
                                    type: DataType.Number,
                                    expression: "min_temp"
                                },
                                "Condition": {
                                    kind: DataKind.Dynamic,
                                    type: DataType.Text,
                                    expression: "weather_state_name"
                                },
                                "Wind speed": {
                                    kind: DataKind.Dynamic,
                                    type: DataType.Text,
                                    expression: "wind_speed"
                                },
                                "Wind direction": {
                                    kind: DataKind.Dynamic,
                                    type: DataType.Text,
                                    expression: "wind_direction"
                                },
                                "Visibility": {
                                    kind: DataKind.Dynamic,
                                    type: DataType.Number,
                                    expression: "visibility"
                                },
                                "Air pressure": {
                                    kind: DataKind.Dynamic,
                                    type: DataType.Number,
                                    expression: "air_pressure"
                                },
                                "Humidity": {
                                    kind: DataKind.Dynamic,
                                    type: DataType.Number,
                                    expression: "humidity"
                                }
                            }
                        }
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
                                value: "https://www.metaweather.com/api/location/2452078/"
                            }
                        }
                    }
                }
            }
        }
    }
}]

/*let source_list: Array<RemoteSource> = [
    {
        key: "openweathermap_forecast",
        name: "Forecast: OpenWeatherMap",
        keys: ["forecast"],
        tags: ["weather"],
        homepage: "https://openweathermap.org",
        syndicate_from: {
            triggers: [],
            format: Format.JSON,
            parser: {
                kind: DataKind.Dynamic,
                type: DataType.Mapping,
                mapping: {
                    title: {
                        kind: DataKind.Dynamic,
                        type: DataType.Text,
                        expression: "city.name"
                        /*fields: {
                            "city": {expression: "city.name"}
                        },
                        template: "Forecast for {{ city }}"*/
                    /*},
                    children: {
                        parser: {
                            root_expression: "list",
                            field_parsers: {
                                date: {
                                    kind: DataKind.Dynamic,
                                    type: DataType.Text,
                                    expression: "dt_txt"
                                },
                                title: {
                                    kind: DataKind.Dynamic,
                                    type: DataType.Text,
                                    expression: "main.temp"
                                },
                                description: {
                                    kind: DataKind.Dynamic,
                                    type: DataType.Text,
                                    expression: "weather[0].description"
                                },
                                   /* fields: {
                                        "temp": {expression: "main.temp"},
                                        "conditions": {expression: "weather[0].description"}
                                    },
                                    template: "{{ conditions }}, {{ temp }}°F"
                                }*/
    
                                /*metadata: {
                                    type: DataType.Mapping,
                                    kind: DataKind.Dynamic,
                                    mapping: {
                                        high: {
                                            kind: DataKind.Dynamic,
                                            type: DataType.Text,
                                            expression: "main.temp_max"
                                        },
                                        low: {
                                            kind: DataKind.Dynamic,
                                            type: DataType.Text,
                                            expression: "main.temp_min"
                                        },
                                        humidity: {
                                            kind: DataKind.Dynamic,
                                            type: DataType.Text,
                                            expression: "main.humidity"
                                        },
                                        pressure: {
                                            kind: DataKind.Dynamic,
                                            type: DataType.Text,
                                            expression: "main.pressure"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            api: {
                protocol: Protocol.HTTP,
                input: {
                    name: "API",
                    is_required: true,
                    kind: DataKind.Dynamic,
                    type: DataType.Mapping,
                    mapping: {
                        url: {
                            name: "URL",
                            is_required: true,
                            kind: DataKind.Dynamic,
                            type: DataType.Mapping,
                            mapping: {
                                root: {
                                    name: "Root",
                                    kind: DataKind.Static,
                                    type: DataType.Text,
                                    is_required: true,
                                    default: {
                                        type: DataType.Text,
                                        value: "https://api.openweathermap.org/data/2.5/forecast"
                                    }
                                },
                                querystring: {
                                    name: "Query parameters",
                                    is_required: true,
                                    kind: DataKind.Dynamic,
                                    type: DataType.Mapping,
                                    mapping: {
                                        "q": {
                                            name: "city",
                                            kind: DataKind.Dynamic,
                                            type: DataType.Text,
                                            is_required: true
                                        },
                                        "units": {
                                            name: "units",
                                            kind: DataKind.Static,
                                            type: DataType.Text,
                                            is_required: false,
                                            default: {
                                                type: DataType.Text,
                                                value: "imperial"
                                            }
                                        },
                                        "APPID": {
                                            name: "API key",
                                            kind: DataKind.Static,
                                            type: DataType.Text,
                                            is_required: true,
                                            default: {
                                                type: DataType.Text,
                                                value: "54086c796ee23c0674592c504fe70e4a"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }/*, {
        id: "openweathermap_current",
        name: "Current weather: OpenWeatherMap",
        languages: ["en"],
        is_active: true,
        keys: ["owm", "weather", "openweathermap"],
        tags: [{type: "topic", text: "weather"}],
        homepage: "https://openweathermap.org",
        syndicate_from: {
            triggers: [],
            blockers: [],
            format: Format.JSON,
            response_parser: {
                root_expression: "",
                field_parsers: {

                }
            },
            api: {
                method: Method.GET,
                endpoint: {
                    root: "https://api.openweathermap.org/data/2.5/weather",
                    query_params: {
                        "q": {
                            key: "city",
                            is_fixed_value: false,
                            is_required: true
                        },
                        "units": {
                            key: "units",
                            is_fixed_value: true,
                            is_required: false,
                            default_value: "imperial"
                        },
                        "APPID": {
                            key: "API key",
                            is_fixed_value: true,
                            is_required: true,
                            default_value: "54086c796ee23c0674592c504fe70e4a"
                        }
                    }
                }
            }
        }
    }, *//*, {
        id: "godaddy",
        name: "GoDaddy",
        languages: ["en"],
        is_active: true,
        keys: ["godaddy"],
        tags: [],
        homepage: "https://godaddy.com/"
    }, {
        id: "gg",
        name: "GG",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://gg.com/"
    }, {
        id: "bitly",
        name: "bit.ly",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://bit.ly/"
    }, {
        id: "vk",
        name: "vk.com",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://vk.com/"
    }, {
        id: "w3",
        name: "W3",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://w3.org/"
    }, {
        id: "baidu",
        name: "Baidu",
        languages: ["en"],
        is_active: true,
        keys: ["baidu"],
        tags: [],
        homepage: "https://baidu.com/"
    }, {
        id: "nytimes",
        name: "New York Times",
        languages: ["en"],
        is_active: true,
        keys: ["nytimes"],
        tags: [],
        homepage: "https://nytimes.com/"
    }, {
        id: "europa.eu",
        name: "Europa.eu",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://europa.eu/"
    }, {
        id: "buydomains.com",
        name: "Buydomains.com",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://buydomains.com/"
    }, {
        id: "wp.com",
        name: "wp.com",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://wp.com/"
    }, {
        id: "statcounter.com",
        name: "statcounter.com",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://statcounter.com/"
    }, {
        id: "miitbeian.gov.cn",
        name: "iitbeian.gov.cn",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://iitbeian.gov.cn/"
    }, {
        id: "jimdo.com",
        name: "jimdo.com",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://jimdo.com/"
    }, {
        id: "blogger.com",
        name: "blogger.com",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://blogger.com/"
    }, {
        id: "blogger.com",
        name: "blogger.com",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://blogger.com/"
    }, {
        id: "weebly",
        name: "Weebly",
        languages: ["en"],
        is_active: true,
        keys: ["weebly"],
        tags: [],
        homepage: "https://weebly.com/"
    }, {
        id: "weebly",
        name: "Weebly",
        languages: ["en"],
        is_active: true,
        keys: ["weebly"],
        tags: [],
        homepage: "https://weebly.com/"
    }, {
        id: "mozilla",
        name: "Mozilla",
        languages: ["en"],
        is_active: true,
        keys: ["mozilla"],
        tags: [],
        homepage: "https://mozilla.org/"
    }, {
        id: "mozilla",
        name: "Mozilla",
        languages: ["en"],
        is_active: true,
        keys: ["mozilla"],
        tags: [],
        homepage: "https://mozilla.org/"
    }, {
        id: "bbc",
        name: "BBC",
        languages: ["en"],
        is_active: true,
        keys: ["bbc"],
        tags: [],
        homepage: "https://bbc.co.uk/"
    }, {
        id: "yandex",
        name: "Yandex",
        languages: ["en"],
        is_active: true,
        keys: ["yandex"],
        tags: [],
        homepage: "https://yandex.ru/"
    }, {
        id: "myspace",
        name: "MySpace",
        languages: ["en"],
        is_active: true,
        keys: ["myspace"],
        tags: [],
        homepage: "https://myspace.com/"
    }, {
        id: "addthis",
        name: "addthis.com",
        languages: ["en"],
        is_active: true,
        keys: ["addthis"],
        tags: [],
        homepage: "https://addthis.com/"
    }, {
        id: "nih.gov",
        name: "Nation Institutes of Health",
        languages: ["en"],
        is_active: true,
        keys: ["nih"],
        tags: [],
        homepage: "https://nih.gov/"
    }, {
        id: "theguardian",
        name: "The Guardian",
        languages: ["en"],
        is_active: true,
        keys: ["guardian"],
        tags: [],
        homepage: "https://theguardian.com/"
    }, {
        id: "cnn.com",
        name: "CNN",
        languages: ["en"],
        is_active: true,
        keys: ["cnn"],
        tags: [],
        homepage: "https://cnn.com/"
    }, {
        id: "stumbleupon",
        name: "StumbleUpon",
        languages: ["en"],
        is_active: true,
        keys: ["stumbleupon"],
        tags: [],
        homepage: "https://stumbleupon.com/"
    }, {
        id: "digg",
        name: "Digg",
        languages: ["en"],
        is_active: true,
        keys: ["digg"],
        tags: [],
        homepage: "https://digg.com/"
    }, {
        id: "addtoany",
        name: "addtoany",
        languages: ["en"],
        is_active: true,
        keys: ["addtoany"],
        tags: [],
        homepage: "https://addtoany.com/"
    }, {
        id: "paypal",
        name: "PayPal",
        languages: ["en"],
        is_active: true,
        keys: ["paypal"],
        tags: [],
        homepage: "https://paypal.com/"
    }, {
        id: "yelp",
        name: "Yelp",
        languages: ["en"],
        is_active: true,
        keys: ["yelp"],
        tags: [],
        homepage: "https://yelp.com/"
    }, {
        id: "huffingtonpost",
        name: "Huffington Post",
        languages: ["en"],
        is_active: true,
        keys: ["huffpo"],
        tags: [],
        homepage: "https://huffingtonpost.com/"
    }, {
        id: "feedburner",
        name: "FeedBurner",
        languages: ["en"],
        is_active: true,
        keys: ["feedburner"],
        tags: [],
        homepage: "https://feedburner.com/"
    }, {
        id: "issuu",
        name: "issuu",
        languages: ["en"],
        is_active: true,
        keys: ["issuu"],
        tags: [],
        homepage: "https://issuu.com/"
    }, {
        id: "wix",
        name: "Wix",
        languages: ["en"],
        is_active: true,
        keys: ["wix"],
        tags: [],
        homepage: "https://wix.com/"
    }, {
        id: "dropbox",
        name: "Dropbox",
        languages: ["en"],
        is_active: true,
        keys: ["dropbox"],
        tags: [],
        homepage: "https://dropbox.com/"
    }, {
        id: "forbes",
        name: "Forbes",
        languages: ["en"],
        is_active: true,
        keys: ["forbes"],
        tags: [],
        homepage: "https://forbes.com/"
    }, {
        id: "miibeian.gov.cn",
        name: "miibeian.gov.cn",
        languages: ["cn"],
        is_active: true,
        keys: ["issuu"],
        tags: [],
        homepage: "https://miibeian.gov.cn/"
    }, {
        id: "aws",
        name: "AWS",
        languages: ["en"],
        is_active: true,
        keys: ["aws"],
        tags: [],
        homepage: "https://amazonaws.com/"
    }, {
        id: "washingtonpost",
        name: "Washington Post",
        languages: ["en"],
        is_active: true,
        keys: ["wapo"],
        tags: [],
        homepage: "https://washingtonpost.com/"
    }, {
        id: "bluehost",
        name: "Bluehost",
        languages: ["en"],
        is_active: true,
        keys: ["bluehost"],
        tags: [],
        homepage: "https://bluehost.com/"
    }, {
        id: "etsy",
        name: "Etsy",
        languages: ["en"],
        is_active: true,
        keys: ["etsy"],
        tags: [],
        homepage: "https://etsy.com/"
    }, {
        id: "go.com",
        name: "go.com",
        languages: ["en"],
        is_active: true,
        keys: ["issuu"],
        tags: [],
        homepage: "https://go.com/"
    }, {
        id: "msn",
        name: "MSN",
        languages: ["en"],
        is_active: true,
        keys: ["msn"],
        tags: [],
        homepage: "https://msn.com/"
    }, {
        id: "wsj",
        name: "Wall Street Journal",
        languages: ["en"],
        is_active: true,
        keys: ["wsj"],
        tags: [],
        homepage: "https://wsj.com/"
    }, {
        id: "ameblo.jp",
        name: "ameblo.jp",
        languages: ["jp"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://ameblo.jp/"
    }, {
        id: "slideshare",
        name: "Slideshare",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://slideshare.net/"
    }, {
        id: "e-recht24.de",
        name: "e-recht24.de",
        languages: ["de"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://e-recht24.de/"
    }, {
        id: "weibo",
        name: "Weibo",
        languages: ["cn"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://weibo.com/"
    }, {
        id: "fc2",
        name: "FC2",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://fc2.com/"
    }, {
        id: "eventbrite",
        name: "Eventbrite",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://eventbrite.com/"
    }, {
        id: "parallels.com",
        name: "Parallels",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://parallels.com/"
    }, {
        id: "doubleclick",
        name: "Doubleclick",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://doubleclick.net/"
    }, {
        id: "mail.ru",
        name: "Mail.ru",
        languages: ["ru"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://mail.ru/"
    }, {
        id: "sourceforge",
        name: "Sourceforge",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://sourceforge.net/"
    }, {
        id: "telegraph.co.uk",
        name: "Telegraph",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://telegraph.co.uk/"
    }, {
        id: "livejournal",
        name: "LiveJournal",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://livejournal.com/"
    }, {
        id: "51.la",
        name: "51.la",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://51.la/"
    }, {
        id: "free.fr",
        name: "free.fr",
        languages: ["fr"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://free.fr/"
    }, {
        id: "dailymail.co.uk",
        name: "Daily Mail",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://dailymail.co.uk/"
    }, {
        id: "reuters",
        name: "Reuters",
        languages: ["en"],
        is_active: true,
        keys: ["reuters"],
        tags: [{type: "topic", text: "news"}],
        homepage: "https://reuters.com/"
    }, {
        id: "taobao",
        name: "Taobao",
        languages: ["cn"],
        is_active: true,
        keys: ["taobao"],
        tags: [],
        homepage: "https://taobao.com/"
    }, {
        id: "wikimedia",
        name: "Wikimedia",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://wikimedia.org/"
    }, {
        id: "typepad.com",
        name: "Typepad",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://typepad.com/"
    }, {
        id: "hatena.ne.jp",
        name: "hatena.ne.jp",
        languages: ["jp"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://hatena.ne.jp/"
    }, {
        id: "bloomberg",
        name: "Bloomberg",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://bloomberg.com/"
    }, {
        id: "elegantthemes.com",
        name: "Elegant Themes",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://elegantthemes.com/"
    }, {
        id: "eepurl",
        name: "eepurl",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://eepurl.com/"
    }, {
        id: "usatoday.com",
        name: "USA Today",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://usatoday.com/"
    }, {
        id: "about.com",
        name: "About.com",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://about.com/"
    }, {
        id: "macromedia.com",
        name: "Macromedia",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://macromedia.com/"
    }, {
        id: "xing.com",
        name: "Xing",
        languages: ["cn"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://xing.com/"
    }, {
        id: "macromedia.com",
        name: "Macromedia",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://macromedia.com/"
    }, {
        id: "time.com",
        name: "Time",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://time.com/"
    }, {
        id: "www.gov.uk",
        name: "www.gov.uk",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://www.gov.uk/"
    }, {
        id: "cdc.gov",
        name: "CDC",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://cdc.gov/"
    }, {
        id: "tripadvisor.com",
        name: "Trip Advisor",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://tripadvisor.com/"
    }, {
        id: "cpanel.net",
        name: "CPanel",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://cpanel.net/"
    }, {
        id: "npr.org",
        name: "National Public Radio",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://npr.org/"
    }, {
        id: "harvard.edu",
        name: "Harvard",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://harvard.edu/"
    }, {
        id: "bbb.org",
        name: "Better Business Bureau",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://bbb.org/"
    }, {
        id: "aol.com",
        name: "aol",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://aol.com/"
    }, {
        id: "constantcontact.com",
        name: "Constant Contact",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://constantcontact.com/"
    }, {
        id: "latimes",
        name: "LA Times",
        languages: ["en"],
        is_active: true,
        keys: ["latimes"],
        tags: [{type: "topic", text: "news"}],
        homepage: "https://latimes.com/"
    }, {
        id: "del.icio.us",
        name: "del.icio.us",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://del.icio.us/"
    }, {
        id: "list-manage.com",
        name: "list-manage.com",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://list-manage.com/"
    }, {
        id: "webs.com",
        name: "webs.com",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://webs.com/"
    }, {
        id: "opera.com",
        name: "Opera",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://opera.com/"
    }, {
        id: "beian.gov.cn",
        name: "beian.gov.cn",
        languages: ["cn"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://beian.gov.cn/"
    }, {
        id: "vkontakte.ru",
        name: "vkontakte.ru",
        languages: ["ru"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://vkontakte.ru/"
    }, {
        id: "live.com",
        name: "live.com",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://live.com/"
    }, {
        id: "bandcamp",
        name: "Bandcamp",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://bandcamp.com/"
    }, {
        id: "apache.org",
        name: "Apache",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://apache.org/"
    }, {
        id: "businessinsider",
        name: "Business Insider",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://businessinsider.com/"
    }, {
        id: "dailymotion",
        name: "Daily Motion",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://dailymotion.com/"
    }, {
        id: "disqus",
        name: "Disqus",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://disqus.com/"
    }, {
        id: "behance.net",
        name: "Behance",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://behance.net/"
    }, {
        id: "mit.edu",
        name: "MIT",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://mit.edu/"
    }, {
        id: "rambler.ru",
        name: "rambler.ru",
        languages: ["ru"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://rambler.ru/"
    }, {
        id: "gnu.org",
        name: "GNU",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://gnu.org/"
    }, {
        id: "sina.com.cn",
        name: "sina.com.cn",
        languages: ["cn"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://sina.com.cn/"
    }, {
        id: "spotify.com",
        name: "Spotify",
        languages: ["en"],
        is_active: true,
        keys: ["spotify"],
        tags: [],
        homepage: "https://spotify.com/"
    }, {
        id: "joomla",
        name: "Joomla",
        languages: ["en"],
        is_active: true,
        keys: ["joomla"],
        tags: [],
        homepage: "https://joomla.org/"
    }, {
        id: "line.me",
        name: "line.me",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://line.me/"
    }, {
        id: "wired.com",
        name: "Wired",
        languages: ["en"],
        is_active: true,
        keys: ["wired"],
        tags: [],
        homepage: "https://wired.com/"
    }, {
        id: "stanford.edu",
        name: "Stanford",
        languages: ["en"],
        is_active: true,
        keys: ["stanford"],
        tags: [],
        homepage: "https://stanford.edu/"
    }, {
        id: "kickstarter",
        name: "Kickstarter",
        languages: ["en"],
        is_active: true,
        keys: ["kickstarter"],
        tags: [],
        homepage: "https://kickstarter.com/"
    }, {
        id: "nasa.gov",
        name: "NASA",
        languages: ["en"],
        is_active: true,
        keys: ["nasa"],
        tags: [],
        homepage: "https://nasa.gov/"
    }, {
        id: "rakuten.co.jp",
        name: "Rakuten",
        languages: ["jp"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://rakuten.co.jp/"
    }, {
        id: "surveymonkey",
        name: "Survey Monkey",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://surveymonkey.com/"
    }, {
        id: "independent.co.uk",
        name: "Independent",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://independent.co.uk/"
    }, {
        id: "whatsapp",
        name: "WhatsApp",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://whatsapp.com/"
    }, {
        id: "one.com",
        name: "One.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://one.com/"
    }, {
        id: "photobucket.com",
        name: "Photobucket",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://photobucket.com/"
    }, {
        id: "ted.com",
        name: "TED",
        languages: [],
        is_active: true,
        keys: ["ted"],
        tags: [],
        homepage: "https://ted.com/"
    }, {
        id: "themeforest.net",
        name: "Theme Forest",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://themeforest.net/"
    }, {
        id: "homestead.com",
        name: "Homestead",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://homestead.com/"
    }, {
        id: "cnet.com",
        name: "CNET",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://cnet.com/"
    }, {
        id: "1und1.de",
        name: "1und1",
        languages: ["de"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://1und1.de/"
    }, {
        id: "deviantart",
        name: "Deviant Art",
        languages: ["en"],
        is_active: true,
        keys: ["deviantart"],
        tags: [],
        homepage: "https://deviantart.com/"
    }, {
        id: "scribd.com",
        name: "Scribd",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://scribd.com/"
    }, {
        id: "jiathis.com",
        name: "jiathis.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://jiathis.com/"
    }, {
        id: "domainname.de",
        name: "domainname.de",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://domainname.de/"
    }, {
        id: "ca.gov",
        name: "ca.gov",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://ca.gov/"
    }, {
        id: "shopify",
        name: "Shopify",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://shopify.com/"
    }, {
        id: "plesk.com",
        name: "Plesk",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://plesk.com/"
    }, {
        id: "wiley.com",
        name: "Wiley",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://wiley.com/"
    }, {
        id: "who.int",
        name: "who.int",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://who.int/"
    }, {
        id: "un.org",
        name: "un.org",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://un.org/"
    }, {
        id: "buzzfeed",
        name: "Buzzfeed",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://buzzfeed.com/"
    }, {
        id: "theatlantic",
        name: "The Atlantic",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://theatlantic.com/"
    }, {
        id: "barnesandnoble",
        name: "Barnes and Noble",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://barnesandnoble.com/"
    }, {
        id: "sakura.ne.jp",
        name: "sakura.ne.jp",
        languages: ["jp"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://sakura.ne.jp/"
    }, {
        id: "pbs.org",
        name: "PBS",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://pbs.org/"
    }, {
        id: "nationalgeographic",
        name: "National Geographic",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://nationalgeographic.com/"
    }, {
        id: "getpocket.com",
        name: "Pocket",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://getpocket.com/"
    }, {
        id: "nature.com",
        name: "Nature",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://nature.com/"
    }, {
        id: "networksolutions.com",
        name: "Network Solutions",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://networksolutions.com/"
    }, {
        id: "webmd",
        name: "WebMD",
        languages: ["en"],
        is_active: true,
        keys: ["webmd"],
        tags: [],
        homepage: "https://webmd.com/"
    }, {
        id: "foxnews.com",
        name: "Fox News",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://foxnews.com/"
    }, {
        id: "cbsnews.com",
        name: "CBS News",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://cbsnews.com/"
    }, {
        id: "techcrunch",
        name: "TechCrunch",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://techcrunch.com/"
    }, {
        id: "booking.com",
        name: "Booking.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://booking.com/"
    }, {
        id: "php.net",
        name: "PHP",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://php.net/"
    }, {
        id: "berkeley.edu",
        name: "Berkeley",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://berkeley.edu/"
    }, {
        id: "cloudfront.net",
        name: "Cloudfront",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://cloudfront.net/"
    }, {
        id: "sciencedirect.com",
        name: "Science Direct",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://sciencedirect.com/"
    }, {
        id: "ibm.com",
        name: "IBM",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://ibm.com/"
    }, {
        id: "a8.net",
        name: "A8",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://a8.net/"
    }, {
        id: "163.com",
        name: "163.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://163.com/"
    }, {
        id: "nbcnews.com",
        name: "NBC News",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://nbcnews.com/"
    }, {
        id: "skype.com",
        name: "Skype",
        languages: [],
        is_active: true,
        keys: ["skype"],
        tags: [],
        homepage: "https://skype.com/"
    }, {
        id: "mashable.com",
        name: "Mashable",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://mashable.com/"
    }, {
        id: "cornell.edu",
        name: "Cornell",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://cornell.edu/"
    }, {
        id: "naver.com",
        name: "Naver",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://naver.com/"
    }, {
        id: "domainretailing.com",
        name: "Domain Retailing",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://domainretailing.com/"
    }, {
        id: "usda.gov",
        name: "USDA",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://usda.gov/"
    }, {
        id: "wp.me",
        name: "wp.me",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://wp.me/"
    }, {
        id: "4.cn",
        name: "4.cn",
        languages: ["cn"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://4.cn/"
    }, {
        id: "springer.com",
        name: "Springer",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://springer.com/"
    }, {
        id: "whitehouse.gov",
        name: "White House",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://whitehouse.gov/"
    }, {
        id: "squarespace.com",
        name: "Squarespace",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://squarespace.com/"
    }, {
        id: "phoca.cz",
        name: "phoca.cz",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://phoca.cz/"
    }, {
        id: "change.org",
        name: "Change.org",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://change.org/"
    }, {
        id: "cbc.ca",
        name: "CBC",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://cbc.ca/"
    }, {
        id: "ft.com",
        name: "ft.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://ft.com/"
    }, {
        id: "epa.gov",
        name: "EPA",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://epa.gov/"
    }, {
        id: "secureserver.net",
        name: "secureserver.net",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://secureserver.net/"
    }, {
        id: "enablejavascript.com",
        name: "enablejavascript.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://enablejavascript.com/"
    }, {
        id: "meetup.com",
        name: "Meetup",
        languages: ["en"],
        is_active: true,
        keys: ["meetup"],
        tags: [],
        homepage: "https://meetup.com/"
    }, {
        id: "noaa.gov",
        name: "NOAA",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://noaa.gov/"
    }, {
        id: "cnbc.com",
        name: "CNBC",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://cnbc.com/"
    }, {
        id: "nps.gov",
        name: "NPS",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://nps.gov/"
    }, {
        id: "phpbb.com",
        name: "PHPBB",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://phpbb.com/"
    }, {
        id: "wikia.com",
        name: "Wikia",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://wikia.com/"
    }, {
        id: "usnews.com",
        name: "US News",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://usnews.com/"
    }, {
        id: "mapquest.com",
        name: "MapQuest",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://mapquest.com/"
    }, {
        id: "trustpilot.com",
        name: "Trust Pilot",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://trustpilot.com/"
    }, {
        id: "domainactive.co",
        name: "domainactive.co",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://domainactive.co/"
    }, {
        id: "uol.com.br",
        name: "uol.com.br",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://uol.com.br/"
    }, {
        id: "foursquare.com",
        name: "Foursquare",
        languages: [],
        is_active: true,
        keys: ["foursquare"],
        tags: [],
        homepage: "https://foursquare.com/"
    }, {
        id: "ow.ly",
        name: "ow.ly",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://ow.ly/"
    }, {
        id: "telegram.me",
        name: "Telegram",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://telegram.me/"
    }, {
        id: "sohu.com",
        name: "sohu.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://sohu.com/"
    }, {
        id: "loc.gov",
        name: "LOC",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://loc.gov/"
    }, {
        id: "economist.com",
        name: "Economist",
        languages: ["en"],
        is_active: true,
        keys: ["economist"],
        tags: [],
        homepage: "https://economist.com/"
    }, {
        id: "fda.gov",
        name: "FDA",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://fda.gov/"
    }, {
        id: "irs.gov",
        name: "IRS",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://irs.gov/"
    }, {
        id: "themegrill.com",
        name: "Theme Grill",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://themegrill.com/"
    }, {
        id: "wufoo.com",
        name: "Wufoo",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://wufoo.com/"
    }, {
        id: "geocities.jp",
        name: "geocities.jp",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://geocities.jp/"
    }, {
        id: "bigcartel.com",
        name: "bigcartel.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://bigcartel.com/"
    }, {
        id: "livedoor.jp",
        name: "livedoor.jp",
        languages: ["jp"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://livedoor.jp/"
    }, {
        id: "chicagotribune.com",
        name: "Chicago Tribune",
        languages: ["en"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://chicagotribune.com/"
    }, {
        id: "dribbble.com",
        name: "Dribbble",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://dribbble.com/"
    }, {
        id: "hp.com",
        name: "HP",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://hp.com/"
    }, {
        id: "doi.org",
        name: "DOI",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://doi.org/"
    }, {
        id: "prnewswire.com",
        name: "PR Newswire",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://prnewswire.com/"
    }, {
        id: "ed.gov",
        name: "ed.gov",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://ed.gov/"
    }, {
        id: "ok.ru",
        name: "ok.ru",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://ok.ru/"
    }, {
        id: "newyorker.com",
        name: "New Yorker",
        languages: ["en"],
        is_active: true,
        keys: ["newyorker"],
        tags: [],
        homepage: "https://newyorker.com/"
    }, {
        id: "abc.net.au",
        name: "abc.net.au",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://abc.net.au/"
    }, {
        id: "bizjournals.com",
        name: "BizJournals",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://bizjournals.com/"
    }, {
        id: "slate.com",
        name: "Slate",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://slate.com/"
    }, {
        id: "houzz.com",
        name: "Houzz",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://houzz.com/"
    }, {
        id: "vice.com",
        name: "Vice",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://vice.com/"
    }, {
        id: "xinhuanet.com",
        name: "xinhuanet.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://xinhuanet.com/"
    }, {
        id: "engadget.com",
        name: "Engadget",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://engadget.com/"
    }, {
        id: "nifty.com",
        name: "nifty.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://nifty.com/"
    }, {
        id: "marriott.com",
        name: "Marriott",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://marriott.com/"
    }, {
        id: "clickbank.net",
        name: "clickbank.net",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://clickbank.net/"
    }, {
        id: "globo.com",
        name: "globo.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://globo.com/"
    }, {
        id: "histats.com",
        name: "histats.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://histats.com/"
    }, {
        id: "state.gov",
        name: "state.gov",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://state.gov/"
    }, {
        id: "cbslocal.com",
        name: "CBS Local",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://cbslocal.com/"
    }, {
        id: "unesco.org",
        name: "UNESCO",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://unesco.org/"
    }, {
        id: "umich.edu",
        name: "UMich",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://umich.edu/"
    }, {
        id: "hostnet.nl",
        name: "hostnet.nl",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://hostnet.nl/"
    }, {
        id: "house.gov",
        name: "House of Representatives",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://house.gov/"
    }, {
        id: "youku.com",
        name: "youku.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://youku.com/"
    }, {
        id: "theverge.com",
        name: "The Verge",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://theverge.com/"
    }, {
        id: "ocn.ne.jp",
        name: "ocn.ne.jp",
        languages: ["jp"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://ocn.ne.jp/"
    }, {
        id: "storify.com",
        name: "Storify",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://storify.com/"
    }, {
        id: "sogou.com",
        name: "sogou.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://sogou.com/"
    }, {
        id: "goo.ne.jp",
        name: "goo.ne.jp",
        languages: ["jp"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://goo.ne.jp/"
    }, {
        id: "fortune.com",
        name: "Fortune",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://fortune.com/"
    }, {
        id: "wunderground.com",
        name: "Weather Underground",
        languages: [],
        is_active: true,
        keys: ["wunderground"],
        tags: [{type: "topic", text: "weather"}],
        homepage: "https://wunderground.com/"
    }, {
        id: "aboutcookies.org",
        name: "About Cookies",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://aboutcookies.org/"
    }, {
        id: "rs6.net",
        name: "rs6.net",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://rs6.net/"
    }, {
        id: "columbia.edu",
        name: "Columbia",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://columbia.edu/"
    }, {
        id: "namejet.com",
        name: "Name Jet",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://namejet.com/"
    }, {
        id: "gofundme.com",
        name: "Go Fund Me",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://gofundme.com/"
    }, {
        id: "oracle.com",
        name: "Oracle",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://oracle.com/"
    }, {
        id: "yale.edu",
        name: "Yale",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://yale.edu/"
    }, {
        id: "psychologytoday.com",
        name: "Psychology Today",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://psychologytoday.com/"
    }, {
        id: "ifeng.com",
        name: "ifeng.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://ifeng.com/"
    }, {
        id: "washington.edu",
        name: "University of Washington",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://washington.edu/"
    }, {
        id: "indiatimes.com",
        name: "India Times",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://indiatimes.com/"
    }, {
        id: "samsung.com",
        name: "Samsung",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://samsung.com/"
    }, {
        id: "athemes.com",
        name: "athemes.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://athemes.com/"
    }, {
        id: "upenn.edu",
        name: "UPenn",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://upenn.edu/"
    }, {
        id: "studiopress.com",
        name: "Studio Press",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://studiopress.com/"
    }, {
        id: "hilton.com",
        name: "Hilton",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://hilton.com/"
    }, {
        id: "debian.org",
        name: "Debian",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://debian.org/"
    }, {
        id: "wikihow.com",
        name: "WikiHow",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://wikihow.com/"
    }, {
        id: "senate.gov",
        name: "Senate",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://senate.gov/"
    }, {
        id: "fastcompany.com",
        name: "Fast Company",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://fastcompany.com/"
    }, {
        id: "mailchimp.com",
        name: "Mailchimp",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://mailchimp.com/"
    }, {
        id: "alibaba.com",
        name: "Alibaba",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://alibaba.com/"
    }, {
        id: "youronlinechoices.com",
        name: "Your Online Choices",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://youronlinechoices.com/"
    }, {
        id: "android.com",
        name: "Android",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://android.com/"
    }, {
        id: "researchgate.net",
        name: "Research Gate",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://researchgate.net/"
    }, {
        id: "ustream.tv",
        name: "ustream.tv",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://ustream.tv/"
    }, {
        id: "dedecms.com",
        name: "dedecms",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://dedecms.com/"
    }, {
        id: "zdnet.com",
        name: "ZDNet",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://zdnet.com/"
    }, {
        id: "home.pl",
        name: "home.pl",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://home.pl/"
    }, {
        id: "exblog.jp",
        name: "exblog.jp",
        languages: ["jp"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://exblog.jp/"
    }, {
        id: "cryoutcreations.eu",
        name: "Cry Out Creations",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://cryoutcreations.eu/"
    }, {
        id: "entrepeneur.com",
        name: "Entrepeneur",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://entrepeneur.com/"
    }, {
        id: "drupal.org",
        name: "Drupal",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://drupal.org/"
    }, {
        id: "sagepub.com",
        name: "SagePub",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://sagepub.com/"
    }, {
        id: "businesswire.com",
        name: "Business Wire",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://businesswire.com/"
    }, {
        id: "shinystat.com",
        name: "Shiny Stat",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://shinystat.com/"
    }, {
        id: "umn.edu",
        name: "University of Minnesota",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://umn.edu/"
    }, {
        id: "jugem.jp",
        name: "jugem.jp",
        languages: ["jp"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://jugem.jp/"
    }, {
        id: "hbr.org",
        name: "Harvard Business Review",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://hbr.org/"
    }, {
        id: "sciencemag.org",
        name: "ScienceMag",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://sciencemag.org/"
    }, {
        id: "ftc.gov",
        name: "FTC",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://ftc.gov/"
    }, {
        id: "1688.com",
        name: "1688.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://1688.com/"
    }, {
        id: "wisc.edu",
        name: "University of Wisconsin",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://wisc.edu/"
    }, {
        id: "ucla.edu",
        name: "University of California - Los Angeles",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://ucla.edu/"
    }, {
        id: "inc.com",
        name: "inc.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://inc.com/"
    }, {
        id: "psu.edu",
        name: "psu.edu",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://psu.edu/"
    }, {
        id: "loopia.se",
        name: "loopia.se",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://loopia.se/"
    }, {
        id: "visma.com",
        name: "visma.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://visma.com/"
    }, {
        id: "dreamhost.com",
        name: "dreamhost.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://dreamhost.com/"
    }, {
        id: "mijndomein.nl",
        name: "mijndomein.nl",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://mijndomein.nl/"
    }, {
        id: "ox.ac.uk",
        name: "ox.ac.uk",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://ox.ac.uk/"
    }, {
        id: "scientificamerican.com",
        name: "Scientific American",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://scientificamerican.com/"
    }, {
        id: "utexas.edu",
        name: "University of Texas",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://utexas.edu/"
    }, {
        id: "sedo.com",
        name: "sedo.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://sedo.com/"
    }, {
        id: "worldbank.org",
        name: "WorldBank",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://worldbank.org/"
    }, {
        id: "hubspot.com",
        name: "Hubspot",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://hubspot.com/"
    }, {
        id: "census.gov",
        name: "Census",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://census.gov/"
    }, {
        id: "arstechnica.com",
        name: "Ars Technica",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://arstechnica.com/"
    }, {
        id: "mysql.com",
        name: "MySQL",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://mysql.com/"
    }, {
        id: "si.edu",
        name: "si.edu",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://si.edu/"
    }, {
        id: "allaboutcookies.org",
        name: "All About Cookies",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://allaboutcookies.org/"
    }, {
        id: "usgs.gov",
        name: "USGS",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://usgs.gov/"
    }, {
        id: "intel.com",
        name: "Intel",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://intel.com/"
    }, {
        id: "shop-pro.jp",
        name: "shop-pro.jp",
        languages: ["jp"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://shop-pro.jp/"
    }, {
        id: "tandfonline.com",
        name: "tandfonline.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://tandfonline.com/"
    }, {
        id: "aliyun.com",
        name: "Aliyun",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://aliyun.com/"
    }, {
        id: "office.com",
        name: "Office.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://office.com/"
    }, {
        id: "alexa.com",
        name: "Alexa",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://alexa.com/"
    }, {
        id: "zendesk.com",
        name: "Zendesk",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://zendesk.com/"
    }, {
        id: "nhk.or.jp",
        name: "nhk.or.jp",
        languages: ["jp"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://nhk.or.jp/"
    }, {
        id: "colorlib.com",
        name: "colorlib.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://colorlib.com/"
    }, {
        id: "accuweather.com",
        name: "AccuWeather",
        languages: [],
        is_active: true,
        keys: ["accuweather"],
        tags: [{type: "topic", text: "weather"}],
        homepage: "https://accuweather.com/"
    }, {
        id: "cisco.com",
        name: "Cisco",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://cisco.com/"
    }, {
        id: "cam.ac.uk",
        name: "cam.ac.uk",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://cam.ac.uk/"
    }, {
        id: "hibu.com",
        name: "hibu.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://hibu.com/"
    }, {
        id: "hollywoodreporter.com",
        name: "Hollywood Reporter",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://hollywoodreporter.com/"
    }, {
        id: "admin.ch",
        name: "admin.ch",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://admin.ch/"
    }, {
        id: "example.com",
        name: "example.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://example.com/"
    }, {
        id: "hhs.gov",
        name: "HHS",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://hhs.gov/"
    }, {
        id: "twitch.tv",
        name: "TwitchTV",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://twitch.tv/"
    }, {
        id: "networkadvertising.org",
        name: "Network Advertising",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://networkadvertising.org/"
    }, {
        id: "nyu.edu",
        name: "NYU",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://nyu.edu/"
    }, {
        id: "teamviewer.com",
        name: "Team Viewer",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://teamviewer.com/"
    }, {
        id: "nazwa.pl",
        name: "nazwa.pl",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://nazwa.pl/"
    }, {
        id: "variety.com",
        name: "Variety",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://variety.com/"
    }, {
        id: "box.com",
        name: "Box.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://box.com/"
    }, {
        id: "prestashop.com",
        name: "Prestashop",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://prestashop.com/"
    }, {
        id: "bls.gov",
        name: "BLS",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://bls.gov/"
    }, {
        id: "bmj.com",
        name: "BMJ.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://bmj.com/"
    }, {
        id: "uchicago.edu",
        name: "University of Chicago",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://uchicago.edu/"
    }, {
        id: "wsimg.com",
        name: "wsimg.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://wsimg.com/"
    }, {
        id: "www.nhs.uk",
        name: "NHS UK",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://www.nhs.uk/"
    }, {
        id: "opensource.org",
        name: "Open Source",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://opensource.org/"
    }, {
        id: "zenfolio.com",
        name: "Zenfolio",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://zenfolio.com/"
    }, {
        id: "usc.edu",
        name: "USC",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://usc.edu/"
    }, {
        id: "va.gov",
        name: "VA",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://va.gov/"
    }, {
        id: "cmu.edu",
        name: "CMU",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://cmu.edu/"
    }, {
        id: "oecd.org",
        name: "OECD",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://oecd.org/"
    }, {
        id: "ieee.org",
        name: "IEEE",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://ieee.org/"
    }, {
        id: "mlb.com",
        name: "Major League Baseball",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://mlb.com/"
    }, {
        id: "ename.com.cn",
        name: "ename.com.cn",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://ename.com.cn/"
    }, {
        id: "usa.gov",
        name: "USA.gov",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://usa.gov/"
    }, {
        id: "steampowered.com",
        name: "Steam",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://steampowered.com/"
    }, {
        id: "redcross.org",
        name: "Red Cross",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://redcross.org/"
    }, {
        id: "bund.de",
        name: "bund.de",
        languages: ["de"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://bund.de/"
    }, {
        id: "thehill.com",
        name: "The Hill",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://thehill.com/"
    }, {
        id: "dictionary.com",
        name: "Dictionary.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://dictionary.com/"
    }, {
        id: "360.cn",
        name: "360.cn",
        languages: ["cn"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://360.cn/"
    }, {
        id: "hostgator.com",
        name: "HostGator",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://hostgator.com/"
    }, {
        id: "icann.org",
        name: "ICANN",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://icann.org/"
    }, {
        id: "dot.gov",
        name: "DOT",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://dot.gov/"
    }, {
        id: "adweek.com",
        name: "Ad Week",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://adweek.com/"
    }, {
        id: "fao.org",
        name: "fao.org",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://fao.org/"
    }, {
        id: "sun.com",
        name: "sun.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://sun.com/"
    }, {
        id: "iubenda.com",
        name: "iubenda.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://iubenda.com/"
    }, {
        id: "gesetze-im-internet.de",
        name: "gesetze-im-internet.de",
        languages: ["de"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://gesetze-im-internet.de/"
    }, {
        id: "tmall.com",
        name: "tmall.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://tmall.com/"
    }, {
        id: "today.com",
        name: "today.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://today.com/"
    }, {
        id: "nginx.org",
        name: "Nginx",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://nginx.org/"
    }, {
        id: "xiti.com",
        name: "xiti.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://xiti.com/"
    }, {
        id: "venturebeat.com",
        name: "Venture Beat",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://venturebeat.com/"
    }, {
        id: "snapchat.com",
        name: "Snapchat",
        languages: [],
        is_active: true,
        keys: ["snapchat"],
        tags: [],
        homepage: "https://snapchat.com/"
    }, {
        id: "ietf.org",
        name: "Internet Engineering Task Force",
        languages: [],
        is_active: true,
        keys: ["ietf"],
        tags: [],
        homepage: "https://ietf.org/"
    }, {
        id: "symantec.com",
        name: "Symantec",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://symantec.com/"
    }, {
        id: "mhlw.go.jp",
        name: "mhlw.go.jp",
        languages: ["jp"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://mhlw.go.jp/"
    }, {
        id: "duke.edu",
        name: "Duke University",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://duke.edu/"
    }, {
        id: "japanpost.jp",
        name: "Japan Post",
        languages: ["jp"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://japanpost.jp/"
    }, {
        id: "giphy.com",
        name: "Giphy",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://giphy.com/"
    }, {
        id: "netscape.com",
        name: "Netscape",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://netscape.com/"
    }, {
        id: "justgiving.com",
        name: "Just Giving",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://justgiving.com/"
    }, {
        id: "sec.gov",
        name: "SEC",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://sec.gov/"
    }, {
        id: "illinois.edu",
        name: "University of Illinois",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://illinois.edu/"
    }, {
        id: "att.com",
        name: "AT&T",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://att.com/"
    }, {
        id: "squareup.com",
        name: "SquareUp",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://squareup.com/"
    }, {
        id: "aboutads.info",
        name: "About Ads",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://aboutads.info/"
    }, {
        id: "gpo.gov",
        name: "GPO",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://gpo.gov/"
    }, {
        id: "tucowsdomains.com",
        name: "Tucows Domains",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://tucowsdomains.com/"
    }, {
        id: "domainnameshop.com",
        name: "Domain Name Shop",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://domainnameshop.com/"
    }, {
        id: "plos.org",
        name: "PLOS",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://plos.org/"
    }, {
        id: "elsevier.com",
        name: "Elsevier",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://elsevier.com/"
    }, {
        id: "biomedcentral.com",
        name: "Bio Med Central",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://biomedcentral.com/"
    }, {
        id: "reference.com",
        name: "Reference.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://reference.com/"
    }, {
        id: "oup.com",
        name: "Oup.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://oup.com/"
    }, {
        id: "ssa.gov",
        name: "SSA",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://ssa.gov/"
    }, {
        id: "libsyn.com",
        name: "libsyn",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://libsyn.com/"
    }, {
        id: "windowsphone.com",
        name: "Windows Phone",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://windowsphone.com/"
    }, {
        id: "ny.gov",
        name: "NY.gov",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://ny.gov/"
    }, {
        id: "bigcommerce.com",
        name: "bigcommerce.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://bigcommerce.com/"
    }, {
        id: "oreilly.com",
        name: "O'Reilly",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://oreilly.com/"
    }, {
        id: "domeneshop.no",
        name: "domeneshop.no",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://domeneshop.no/"
    }, {
        id: "googleapis.com",
        name: "Google APIs",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://googleapis.com/"
    }, {
        id: "artisteer.com",
        name: "Artisteer",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://artisteer.com/"
    }, {
        id: "thenextweb.com",
        name: "The Next Web",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://thenextweb.com/"
    }, {
        id: "gotowebinar.com",
        name: "Go To Webinar",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://gotowebinar.com/"
    }, {
        id: "deloitte.com",
        name: "deloitte.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://deloitte.com/"
    }, {
        id: "blackberry.com",
        name: "Blackberry",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://blackberry.com/"
    }, {
        id: "w3schools.com",
        name: "W3Schools",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://w3schools.com/"
    }, {
        id: "dol.gov",
        name: "DOL",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://dol.gov/"
    }, {
        id: "python.org",
        name: "Python",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://python.org/"
    }, {
        id: "siteorigin.com",
        name: "siteorigin.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://siteorigin.com/"
    }, {
        id: "ewebdevelopment.com",
        name: "ewebdevelopment.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://ewebdevelopment.com/"
    }, {
        id: "moz.com",
        name: "Moz",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://moz.com/"
    }, {
        id: "warnerbros.com",
        name: "Warner Bros",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://warnerbros.com/"
    }, {
        id: "justice.gov",
        name: "US Department of Justice",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://justice.gov/"
    }, {
        id: "quantcast.com",
        name: "Quantcast",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://quantcast.com/"
    }, {
        id: "dhs.gov",
        name: "DHS",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://dhs.gov/"
    }, {
        id: "java.com",
        name: "Java",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://java.com/"
    }, {
        id: "fcc.gov",
        name: "FCC",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://fcc.gov/"
    }, {
        id: "congress.gov",
        name: "US Congress",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://congress.gov/"
    }, {
        id: "playstation.com",
        name: "PlayStation",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://playstation.com/"
    }, {
        id: "iso.org",
        name: "ISO",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://iso.org/"
    }, {
        id: "opencart.com",
        name: "Open Cart",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://opencart.com/"
    }, {
        id: "eff.org",
        name: "Electronic Frontier Foundation",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://eff.org/"
    }, {
        id: "ucl.ac.uk",
        name: "ucl.ac.uk",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://ucl.ac.uk/"
    }, {
        id: "moodle.org",
        name: "Moodle",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://moodle.org/"
    }, {
        id: "web.de",
        name: "web.de",
        languages: ["de"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://web.de/"
    }, {
        id: "msdn.com",
        name: "MSDN",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://msdn.com/"
    }, {
        id: "nist.gov",
        name: "NIST",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://nist.gov/"
    }, {
        id: "unicef.org",
        name: "UNICEF",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://unicef.org/"
    }, {
        id: "mlit.go.jp",
        name: "mlit.go.jp",
        languages: ["jp"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://mlit.go.jp/"
    }, {
        id: "canada.ca",
        name: "Canada.ca",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://canada.ca/"
    }, {
        id: "bitbucket.org",
        name: "Bitbucket",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://bitbucket.org/"
    }, {
        id: "dmca.com",
        name: "dmca.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://dmca.com/"
    }, {
        id: "etracker.de",
        name: "etracker.de",
        languages: ["de"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://etracker.de/"
    }, {
        id: "mynavi.jp",
        name: "MyNavi",
        languages: ["jp"],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://mynavi.jp/"
    }, {
        id: "aarp.org",
        name: "AARP",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://aarp.org/"
    }, {
        id: "gartner.com",
        name: "Gartner",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://gartner.com/"
    }, {
        id: "starwoodhotels.com",
        name: "Starwood Hotels",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://starwoodhotels.com/"
    }, {
        id: "typeform.com",
        name: "Typeform",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://typeform.com/"
    }, {
        id: "acm.org",
        name: "ACM",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://acm.org/"
    }, {
        id: "sedoparking.com",
        name: "sedoparking.com",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://sedoparking.com/"
    }, {
        id: "ticketmaster.com",
        name: "TicketMaster",
        languages: [],
        is_active: true,
        keys: [],
        tags: [],
        homepage: "https://ticketmaster.com/"
    }*/
/*]*/

export {source_list};