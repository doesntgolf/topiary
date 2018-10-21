/**
 * Schema
 */

export interface SourceID {
    key: string; // needs to be unique only within own directory list
    directory_key: string; // url of RemoteDirectory where it comes from. "local" if not from a remote directory.
}

export interface Source {
    id: SourceID;
    subscribed: boolean; // whether this source should pick up updates from the remote directory.

    name: string;
    description?: string;
    weight?: number; // multiplier for result scores, defaults to 1
    homepage?: string;
    related_sources: Array<SourceID>;

    is_active: boolean; // Use to "delete" a source. If it's from a remote directory, can't actually delete because then it would be seen as a "new" source the next time data is fetched from that directory.

    keys: Array<string>;
    tags: Array<SourceTag>;

    forward_to?: URLParameter;
    syndicate_from?: Syndicator;

    terms?: Array<[string, string]>; // [field_name, term]
    relevance?: {
        [field_name: string]: {
            [term: string]: number; // a term's relevance within that field: ( occurrences / total terms )
        }
    }
}

export interface RemoteDirectory {
    name?: string;
    url: string;
    subscribed: boolean;
    refresh_rate?: number;
    weight?: number;
}
export interface RemoteSource {
    key: string;
    name: string;
    description?: string;
    homepage?: string;

    related_sources: Array<SourceID>;

    keys: Array<string>;
    tags: Array<SourceTag["text"]>;

    forward_to?: URLParameter;
    syndicate_from?: Syndicator;
}


export interface Tag {
    text: string;
    type: "meta"|"topic"|"info"|"format"|"language";
    params_to_implement?: Array<Parameter>;
    triggers?: Array<Trigger>;
    weight?: number;
    terms?: Array<string>;
}

export interface SourceTag {
    text: string;
    param_map?: {
        [local: string]: string; // mapping from source param.name to tag param.name.
    }
}

/**
 * tag examples:
 * 
 * {type: "meta", text: "default"}
 * {type: "topic", text: "politics"}
 * {type: "info", text: "contains ads"}
 * {type: "format", text: "video"}
 * {type: "language", text: "en"}
 */

interface Trigger {
    term: string;
    type: "regex" | "starts" | "contains" | "ends";
    case_sensitive: boolean;
    map_to_parameter_of_key?: string;
    substitute_with?: string;
    adjust_weight_by?: number;
    remove_from_phrase: boolean;
}

export interface Syndicator {
    usage_policy?: string;
    triggers: Array<Trigger>;

    timeout?: number;
    api: API;
    format: Format;
    parser: Parser;
}


export interface Queryable {
    source: {
        id: SourceID,
        name: Source["name"],
        weight?: number
    }
    make_request(query: Query): Promise<any>;
    parse_response(response: any): ResultList|Output|null;
}


export const enum Protocol {
    HTTP,
    BrowserBookmarks,
    BrowserHistory,
    Directory,
    QueryStatistics,
    UploadedData
}



interface Basic_API<P extends Protocol> {
    protocol: P;
    input: Parameter;
    paginator?: {
        has_next_page: string;
        parameters_to_increment: {
            [param_key: string]: number; // Number to increment the given parameter by. Note: this means we can only paginate through APIs where the relevant parameters are entirely numeric, and we know ahead of time how much to increment the parameters by.
        };
    }
}
interface HTTP_API extends Basic_API<Protocol.HTTP> {
    input: {
        name: string,
        type: DataType.Mapping,
        mapping: {
            "method": TextParameter
            "url": URLParameter,
            "headers"?: {
                name: "Headers",
                type: DataType.Mapping,
                mapping: {
                    [header_key: string]: SimpleParameter;
                }
            },
            "body"?: SimpleParameter;
        }
    }
}

interface Browser_Bookmarks_API extends Basic_API<Protocol.BrowserBookmarks> {
    input: {
        name: "phrase",
        is_required: true,
        kind: DataKind.Dynamic,
        type: DataType.Text
    }
}
interface Browser_History_API extends Basic_API<Protocol.BrowserHistory> {
    input: {
        name: "phrase",
        is_required: true,
        kind: DataKind.Dynamic,
        type: DataType.Text
    }
}
interface Directory_API extends Basic_API<Protocol.Directory> {
    input: {
        name: "phrase",
        is_required: true,
        kind: DataKind.Dynamic,
        type: DataType.Text
    }
}
interface Query_Statistics_API extends Basic_API<Protocol.QueryStatistics> {
    input: {
        name: "phrase",
        is_required: true,
        kind: DataKind.Dynamic,
        type: DataType.Text
    }
}
interface Uploaded_Data_API extends Basic_API<Protocol.UploadedData> {
    input: {
        name: "phrase",
        is_required: true,
        kind: DataKind.Dynamic,
        type: DataType.Text
    }
}
export type API = HTTP_API | Browser_Bookmarks_API | Browser_History_API | Directory_API | Query_Statistics_API | Uploaded_Data_API;


let wikipedia_api: HTTP_API = {
    protocol: Protocol.HTTP,

    input: {
        name: "Endpoint",
        type: DataType.Mapping,

        mapping: {
            "method": {
                type: DataType.Text,
                kind: DataKind.Static,
                name: "Method",
                value: "GET",
                is_required: true
            },
            "url": {
                type: DataType.Mapping,
                mapping: {
                    "root": {
                        name: "URL",
                        is_required: true,
                        kind: DataKind.Static,
                        type: DataType.Text,
                        value: "https://wikipedia.org"
                    },
                    "querystring": {
                        name: "Query parameters",
                        type: DataType.Mapping,
                        mapping: {
                            q: {
                                name: "phrase",
                                is_required: true,
                                kind: DataKind.Dynamic,
                                type: DataType.Text,
                            }
                        }
                    }
                }
            }
        }
    }
}






export interface Query {
    fields: {
        [name: string]: SimpleData;
    }
    source_specific: Array<{
        source: SourceID,
        fields: {
            [name: string]: SimpleData;
        }
    }>
    options: {
        redirect?: SourceID;
        include_ids?: Array<SourceID>;
        exclude_ids?: Array<SourceID>;
    
        include_tags?: Array<Tag["text"]>;
        exclude_tags?: Array<Tag["text"]>;
    }

    pipeline: Array<Transform>;
}

export interface Status {
    source: {
        id: SourceID,
        name: Source["name"]
    },
    request?: Data;
    is_completed: boolean;
    is_success: boolean;

    response?: Data;
    response_time?: number;
    parse_time?: number;
    error?: {
        reason: FailureReason;
        message?: string;
    };
}

export const enum FailureReason {
    CouldntContactServer,
    Timeout,
    ServerError,
    RequestError,
    ParseError,
    NoPermission,
    UnsetRequiredParameter
}



export const enum Format {
    JSON = "JSON",
    XML = "XML",
    HTML = "HTML"
    // CSV = "CSV" @TODO
}

export interface ResultList extends ListOutput {
    list: Array<Result>;
}
export interface Result extends MappingOutput {
    mapping: {
        title?: TextOutput;
        score?: NumberOutput;
        description?: TextOutput;
        date?: TextOutput|NumberOutput;
        retrieved_at?: TextOutput|NumberOutput
        link?: TextOutput;
        image_url?: TextOutput;
        audio_url?: TextOutput;
        video_url?: TextOutput;
        iframe_url?: TextOutput;
        html?: TextOutput;
        license?: TextOutput;

        identifier?: TextOutput|NumberOutput;

        metadata?: MappingOutput;
        children?: ResultList;

        yielded_queries?: ListOutput;
    };
    
    yielded_queries?: Array<QueryTemplate>;
}


/**
 * A ListParser extended with superpowers, and shaped in 
 * a way that we conveniently know how to display nicely.
 */
export interface ResultListParser extends ListParser {
    expression?: string;
    result_parser: ResultParser;
}
export interface ResultParser extends MappingParser {
    expression?: string;
    mapping: {
        title?: TextParser|ParserTemplate;
        score?: NumberParser;
        description?: TextParser|ParserTemplate;
        date?: TextParser|ParserTemplate|NumberParser;
        link?: TextParser|ParserTemplate;
        image_url?: TextParser|ParserTemplate;
        audio_url?: TextParser|ParserTemplate;
        video_url?: TextParser|ParserTemplate;
        iframe_url?: TextParser|ParserTemplate;
        html?: TextParser|ParserTemplate;
        license?: SimpleParser;

        suggestions?: ListParser;

        identifier?: SimpleParser;

        metadata?: MappingParser;
        children?: ListParser;

        query_yielders?: ListParser;
    }
}


export interface QueryTemplate {
    name?: string;
    description?: string;
    button_text?: string;
    inputs: Array<{
        param: TextParameter|NumberParameter|BooleanParameter; // should inputs here only go into source_specific, only into fields[param.key] if mappings is undefined/empty, or both places?
        source_mapping?: Array<{
            source: SourceID,
            field_name: string
        }>
    }>;
    options: Query["options"];

    default_face?: Face;
}


export interface Results {
    list: Array<Result>;

    redirect?: {
        to: {
            source: SourceID,
            name: Source["name"]
        },
        url: string
    };
    elsewhere?: Array<{
        source: {
            source: SourceID,
            name: Source["name"]
        };
        url: string;
    }>;
    suggestions?: Array<{
        item: string;
        via: {
            source: SourceID,
            name: Source["name"]
        };
    }>;

    details: Array<Status>;
    is_completed: boolean;

    query_parse_time?: number;
    request_build_time?: number;
    search_time?: number;
}


export const enum MsgMethod {
    Create,
    Read,
    Update,
    Delete,
}
export const enum MsgObject {
    Preferences,
    SavedQueries,
    Tags,
    Sources,
    Errors,
}
export interface Message {
    method: MsgMethod;
    object: MsgObject;
    args: any; // @TODO: how to annotate args type and return type per object/kind permutation?
}

export const enum PortObject {
    Query,
    PlaygroundQuery
}
export interface PortMessage {
    object: PortObject;
    args: any;
}


export interface Preferences {
    theme: "light" | "dark";
    layout: "";

    pagination_type: "paginated" | "expanding";
    directory_order: "by_usage" | "alphabetical";
    browser_popup_queries: "in_popup" | "new_tab" | "current_tab";
    browser_popup_forwards: "current_tab" | "new_tab";

    log_queries: boolean;

    redirect_source_prefix: string;
    include_source_prefix: string;
    exclude_source_prefix: string;

    include_tag_prefix: string,
    exclude_tag_prefix: string;

    directory_lists: Array<string>;
    directory_lists_refresh_interval: number;
    default_request_timeout: number;
    trigger_bonus: number; // score multiplier for sources that are triggered
}



export interface SavedQuery {
    name: string;
    query: Query;
    face: Face;
}


// Result layouts: list, grid, table, graph
export type Face = "List"|"Table"|"Grid";

// graphtypes = "Bar"|"Line"|"Map"|"Pie"|"ScatterPlot";


/*
interface JSON_Object {
    [key: string]: anyJSON;
}
interface JSON_Array {
    [index: number]: anyJSON;
}
type anyJSON = string|number|boolean|null|JSON_Object|JSON_Array;
*/

/*
First draft of data structures for graph outputs.

interface BarGraph {
    title: string;
    bars: Array<{
        label: string;
        value: number;
        full_result?: Result;
    }>,
    labels: {
        x: string,
        y: string
    }
}
interface PieGraph {
    title: string;
    pieces: Array<{
        label: string;
        value: number;
        full_result?: Result;
    }>
}
interface LineGraph {
    title: string;

}
interface ScatterPlot {

}
*/


/**
 * Typed values, or: the topiary type system
 * 
 * For use in Parameters, Parsers, and Outputs.
 * 
 * I think most/all of these can be made generic if/when
 * https://github.com/Microsoft/TypeScript/issues/20375
 * is resolved.
 * 
 * I know a lot of these could extend each other, but they're not
 * right now for sake of simplicity and clarity, plus I'm lazy.
 */
export const enum DataType {
    Text = "text",
    Number = "number",
    Boolean = "boolean",
    List = "list",
    Mapping = "mapping",
    Template = "template"
}
export const enum DataKind {
    Dynamic = "dynamic",
    Static = "static"
}

export interface TextData {
    type: DataType.Text,
    value: string
}
export interface NumberData {
    type: DataType.Number,
    value: number
}
export interface BooleanData {
    type: DataType.Boolean,
    value: boolean
}
export interface ListData {
    type: DataType.List,
    list: Array<Data>
}
export interface MappingData {
    type: DataType.Mapping,
    mapping: {
        [name: string]: Data|undefined;
    }
}

export type SimpleData = TextData | NumberData | BooleanData;
export type CompositeData = ListData | MappingData;
export type Data = SimpleData | CompositeData;



export interface URLData extends MappingData {
    mapping: {
        "root": {
            type: DataType.Text,
            value: string
        },
        "querystring"?: {
            type: DataType.Mapping,
            mapping: {
                [querystring_key: string]: {
                    type: DataType.Text,
                    value: string;
                }
            }
        },
        "hash"?: {
            type: DataType.Text,
            value: string
        },
    }
}



/**
 * Typed fields
 */
export interface TextOutput {
    type: DataType.Text,
    value: string;
    matches?: Array<{begin: number, end: number}>
}
export interface NumberOutput {
    type: DataType.Number,
    value: number,
    normalized?: number
}
export interface BooleanOutput {type: DataType.Boolean, value: boolean}
export interface ListOutput {
    type: DataType.List,
    list: Array<Output>
}
export interface MappingOutput {
    type: DataType.Mapping,
    mapping: {
        [name: string]: Output|undefined;
    },
    source?: {
        name: Source["name"],
        id: SourceID
    }
}
export type Output = TextOutput | NumberOutput | BooleanOutput | ListOutput | MappingOutput;




/**
 * Static values
 * 
 * For parsers and parameters
 */

interface StaticTextValue extends TextData {kind: DataKind.Static}
interface StaticNumberValue extends NumberData {kind: DataKind.Static}
interface StaticBooleanValue extends BooleanData {kind: DataKind.Static}
export type StaticValue = StaticTextValue | StaticNumberValue | StaticBooleanValue;




/**
 * Typed parsers
 */

export interface TextParser {
    kind: DataKind.Dynamic;
    type: DataType.Text;
    expression?: string;
    match_markers?: {begin: string, end: string};
}
export interface NumberParser {
    kind: DataKind.Dynamic;
    type: DataType.Number;
    expression?: string;
    range?: {low: number, high: number};
}
export interface BooleanParser {
    kind: DataKind.Dynamic;
    type: DataType.Boolean;
    expression?: string;
}
export interface ParserTemplate {
    type: DataType.Template;
    expression?: string;
    lookup: MappingParser["mapping"];
    template: string;
}

export type SimpleParser = TextParser | NumberParser | BooleanParser;


interface ListParser {
    type: DataType.List;
    expression?: string;
    result_parser: Parser;
}
export interface MappingParser {
    type: DataType.Mapping;
    expression?: string;
    mapping: {
        [role: string]: Parser|undefined;
    },
    source?: SourceID;
    // query_yielders?: Array<{}>;
}

export type CompositeParser = ListParser | MappingParser;
export type Parser = SimpleParser | CompositeParser | StaticValue | ParserTemplate;






/**
 * Typed parameters
 */
export interface BasicParameter<D extends SimpleData> {
    type: D["type"];
    kind: DataKind;

    name: string;
    is_required: boolean;

    description?: string;
    value?: D["value"];
    options?: Array<{
        label: string;
        value: D["value"];
    }>;
}

export interface TextParameter extends BasicParameter<TextData> {
    min_length?: number;
    max_length?: number;
}
export interface NumberParameter extends BasicParameter<NumberData> {
    lower_bound?: number;
    upper_bound?: number;
    step?: number;
}
export interface BooleanParameter extends BasicParameter<BooleanData> {}

export type SimpleParameter = TextParameter | NumberParameter | BooleanParameter;


export interface TemplateParameter {
    type: DataType.Template;
    lookup: MappingParameter["mapping"];
    template: string;
}

export interface ListParameter {
    type: DataType.List;
    list: Array<Parameter>;
}

export interface MappingParameter {
    type: DataType.Mapping;
    mapping: {
        [name: string]: Parameter|undefined;
    }
}

export type CompositeParameter = ListParameter | MappingParameter | TemplateParameter;

export type Parameter = SimpleParameter | CompositeParameter;



export interface URLParameter extends MappingParameter {
    mapping: {
        "root": SimpleParameter,
        "querystring"?: {
            name: "Query parameters",
            type: DataType.Mapping,
            mapping: {
                [querystring_key: string]: SimpleParameter;
            }
        },
        "hash"?: SimpleParameter
    }
}



/**
 * operation
 */
export const enum OperationKind {
    FTS,
    Filter,
    Aggregate,
    Transform
}
export interface FTSOperation {
    kind: OperationKind.FTS;
    query: string;
    b: number;
    k1: number;
    fields_to_index: Array<string>;
    store_match_pos: boolean;
    //as_language: string;
}
export interface FilterOperation {
    kind: OperationKind.Filter;
    condition: Condition;
}
export interface AggregateOperation {
    kind: OperationKind.Aggregate;
    join: Array<{
        condition: Condition,
        under: string /*Grouping*/
    }>
    remainder: string // Grouping
}
export interface TransformOperation {
    kind: OperationKind.Transform;
    condition?: Condition;
    transform: Transform;
}
export type Operation = FTSOperation | FilterOperation | AggregateOperation | TransformOperation;




/**
 * Conditions
 */
interface BasicCondition<Input extends Data, T extends DataType|"generic" = Input["type"]> {
    input: Input;
    type: T;

    and: Array<Condition>;
    or: Array<Condition>;
}
interface TextCondition extends BasicCondition<TextData> {
    operation: {
        operator: "Is",
        operand: TextData;
    } | {
        operator: "IsNot",
        operand: TextData;
    } | {
        operator: "BeginsWith",
        operand: TextData;
    } | {
        operator: "DoesNotBeginWith",
        operand: TextData;
    } | {
        operator: "EndsWith",
        operand: TextData;
    } | {
        operator: "DoesNotEndWith",
        operand: TextData;
    } | {
        operator: "Contains",
        operand: TextData;
    } | {
        operator: "DoesNotContain",
        operand: TextData;
    } | {
        operator: "RegExpMatch",
        operand: TextData;
    } | {
        operator: "LongerThan",
        operand: TextData;
    } | {
        operator: "ShorterThan",
        operand: TextData;
    } | {
        operator: "IsLength",
        operand: TextData;
    }
}
interface NumberCondition extends BasicCondition<NumberData> {
    operation: {
        operator: "EqualTo",
        operand: NumberData;
    } | {
        operator: "NotEqualTo",
        operand: NumberData;
    } | {
        operator: "GreaterThan",
        operand: NumberData;
    } | {
        operator: "GreaterThanOrEqualTo",
        operand: NumberData;
    } | {
        operator: "LessThan",
        operand: NumberData;
    } | {
        operator: "LessThanOrEqualTo",
        operand: NumberData;
    }
}
interface BooleanCondition extends BasicCondition<BooleanData> {
    operation: {
        operator: "Is",
        operand: BooleanData;
    } | {
        operator: "IsNot",
        operand: BooleanData;
    }
}
interface ListCondition extends BasicCondition<ListData> {
    operation: {
        operator: "IsLongerThan",
        operand: NumberData;
    } | {
        operator: "IsShorterThan",
        operand: NumberData;
    } | {
        operator: "IsLength",
        operand: NumberData;
    }
}
interface MappingCondition extends BasicCondition<MappingData> {
    operation: {
        operator: "IsLargerThan",
        operand: NumberData;
    } | {
        operator: "IsSmallerThan",
        operand: NumberData;
    } | {
        operator: "IsSize",
        operand: NumberData;
    } | {
        operator: "HasOutputWithName",
        operand: TextData;
    } | {
        operator: "DoesNotHaveOutputWithName",
        operand: TextData;
    }
}
interface GenericCondition extends BasicCondition<Data, "generic"> {
    operation: {
        operator: "IsSet",
        operand: null,
    } | {
        operator: "IsNotSet",
        operand: null,
    } | {
        operator: "IsText",
        operand: null,
    } | {
        operator: "IsNotText",
        operand: null
    } | {
        operator: "IsNumber",
        operand: null
    } | {
        operator: "IsNotNumber",
        operand: null
    } | {
        operator: "IsBoolean",
        operand: null
    } | {
        operator: "IsNotBoolean",
        operand: null
    } | {
        operator: "IsSize",
        operand: null
    }
}
export type Condition = TextCondition | NumberCondition | BooleanCondition | ListCondition | MappingCondition | GenericCondition;




/**
 * Transforms
 */

interface TextTransform {
    input: TextData;
    operation: {
        operator: "append";
        operand: TextData;
    } | {
        operator: "prepend";
        operand: TextData;
    }
}

interface NumberTransform {
    input: NumberData;
    operation: {
        operator: "add";
        operand: NumberData;
    } | {
        operator: "subtract";
        operand: NumberData;
    } | {
        operator: "multiply";
        operand: NumberData;
    } | {
        operator: "divide";
        operand: NumberData;
    } | {
        operator: "remainder";
        operand: NumberData;
    }
}

interface BooleanTransform {
    input: BooleanData;
    operation: {
        operator: "switch";
        operand: null;
    }
}

interface ListTransform {
    input: ListData;
    operation: {
        operator: "sort";
        operand: [string, "ascending"|"descending"] // field_name, "ascending" | "descending";
    } | {
        operator: "limit",
        operand: number;
    } | {
        operator: "offset";
        operand: number;
    }
}

export type Transform = TextTransform | NumberTransform | BooleanTransform | ListTransform;
