/**
 * Small, shared functionality for frontend or backend.
 */

import {Data, DataType, ListData, MappingData, SimpleData, URLData, ParserTemplate, 
    Parser, ResultParser, MappingParser, SimpleParser, DataKind, StaticValue, Parameter, SimpleParameter, TextParameter, NumberParameter, BooleanParameter, TemplateParameter, TextParser, NumberParser, BooleanParser, TextOutput} from "./schema";


export function is_url(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch(e) {
        return false;
    }
}


export function set_title(title: string): void {
    document.title = title;
}


export function find_next_match(
    field: TextOutput,
    field_parser: TextParser
): TextOutput {

    // Ensure that the match_markers exist and aren't blank strings.
    if (field_parser.match_markers && Object.values(field_parser.match_markers).every((marker) => {
        return marker.length > 0;
    })) {
        field.matches = field.matches || [];

        let start_match = field.value.indexOf(field_parser.match_markers.begin);

        if (start_match >= 0) {
            let cut_up_copy = field.value.replace(field_parser.match_markers.begin, "");
            let end_match = cut_up_copy.indexOf(field_parser.match_markers.end, start_match);

            if (end_match >= 0) {
                field.value = cut_up_copy.replace(field_parser.match_markers.end, "");
                field.matches.push({begin: start_match, end: end_match});
                field = find_next_match(field, field_parser);
            }
        }
    }

    return field;
}



export function data_are_equal(one: Data, two: Data): boolean {

    if (one.type !== two.type) {
        return false;
    } else {
        switch(one.type) {
            case DataType.List:
                return one.list.length === (<ListData>two).list.length
                    && one.list.every((item: Data, index) => {
                        return data_are_equal(item, (<ListData>two).list[index]);
                    })
                break;

            case DataType.Mapping:
                return Object.keys(one.mapping).length === Object.keys((<MappingData>two).mapping).length
                    && Object.entries(one.mapping).every(([key, value]) => (
                        ((<MappingData>two).mapping[key] !== undefined)
                        && data_are_equal(value!, (<MappingData>two).mapping[key]!)
                    ))
                break;

            case DataType.Text || DataType.Number || DataType.Boolean:
                return one.value === (<SimpleData>two).value;
                break;

            default:
                throw("Unhandled data type.");
        }
    }
}


export function build_url(input: URLData): string {
    let root = input.mapping.root.value;

    let querystring = "";
    if (input.mapping.querystring) {
        querystring = Object.entries(input.mapping.querystring.mapping).map(([key, param], index) => {
            return (index === 0 && !root.includes("?") ? "?" : "&") + encodeURIComponent(key) + "=" + encodeURIComponent(param.value);
        }).join("");
    }

    let hash = "";
    if (input.mapping.hash) {
        hash = "#" + encodeURIComponent(input.mapping.hash.value);
    }

    return root + querystring + hash;
}




export function is_static_value(parser: Parser): parser is StaticValue {
    return (<StaticValue>parser).kind === DataKind.Static;
}

export function is_simple_parser(parser: Parser): parser is SimpleParser {
    return (<SimpleParser>parser).kind === DataKind.Dynamic;
}

export function data_reduce(data: Data): object|string|number|boolean|Array<object|string|number|boolean> {
    switch(data.type) {
        case DataType.Mapping:
            return Object.entries(data.mapping).reduce((acc, [key, item]) => {
                if (item !== undefined) {
                    acc[key] = data_reduce(item);
                }
                return acc;
            }, {});
        
        case DataType.List:
            return data.list.map(data_reduce);

        default:
            return data.value;
    }
}


/**
 * Reduce compound parameters to Dynamic or Static simple parameters.
 * 
 * The type system doesn't yet adequately express that this is what's happening.
 */
export function reduce_parameters(param: Parameter, kind: DataKind): Array<Parameter> {
    if (param.type === DataType.Mapping) {
        return Object.values(param.mapping).reduce((acc: Array<Parameter>, inner_param) => {
            if (inner_param !== undefined) {
                acc = acc.concat(reduce_parameters(inner_param, kind));
            }
            return acc;
        }, [])
    } else if (param.type === DataType.List) {
        return param.list.reduce((acc: Array<Parameter>, inner_param) => {
            if (inner_param !== undefined) {
                acc = acc.concat(reduce_parameters(inner_param, kind));
            }
            return acc;
        }, [])
    } else if (param.type === DataType.Template) {
        return Object.values(param.lookup).reduce((acc: Array<Parameter>, inner_param) => {
            if (inner_param !== undefined) {
                acc = acc.concat(reduce_parameters(inner_param, kind));
            }
            return acc;
        }, [])
    } else if (param.kind === kind) {
        return [param];
    } else {
        return [];
    }
}



export function is_simple_parameter(param: Parameter): param is SimpleParameter {
    return (<SimpleParameter>param).name !== undefined;
}



export function param_has_simple_input(param: Parameter): param is TextParameter|NumberParameter|BooleanParameter {
    return [DataType.Text, DataType.Number, DataType.Boolean].includes(param.type);
}
export function param_has_simple_output(param: Parameter): param is TextParameter|NumberParameter|BooleanParameter|TemplateParameter {
    return [DataType.Text, DataType.Number, DataType.Boolean, DataType.Template].includes(param.type);
}

export function parser_has_simple_input(parser: Parser): parser is TextParser|NumberParser|BooleanParser|StaticValue {
    return [DataType.Text, DataType.Number, DataType.Boolean].includes(parser.type);
}
export function parser_has_simple_output(parser: Parser): parser is TextParser|NumberParser|BooleanParser|StaticValue|ParserTemplate {
    return [DataType.Text, DataType.Number, DataType.Boolean, DataType.Template].includes(parser.type);
}


/**
 * Reduce a parameter to an array of simple input parameters.
 */
export function query_input_parameters(param: Parameter): Array<TextParameter|NumberParameter|BooleanParameter> {
    if (param_has_simple_input(param)) {
        if (param.kind === DataKind.Dynamic) {
            return [param];
        } else {
            return [];
        }
    } else if (param.type === DataType.List) {
        return param.list.reduce((acc: Array<TextParameter|NumberParameter|BooleanParameter>, inner_param) => {
            return acc.concat(query_input_parameters(inner_param));
        }, [])
    } else if (param.type === DataType.Mapping) {
        return Object.values(param.mapping).reduce((acc: Array<TextParameter|NumberParameter|BooleanParameter>, inner_param) => {
            if (inner_param !== undefined) {
                acc = acc.concat(query_input_parameters(inner_param));
            }
            return acc;
        }, [])
    } else {
        return Object.values(param.lookup).reduce((acc: Array<TextParameter|NumberParameter|BooleanParameter>, inner_param) => {
            if (inner_param !== undefined) {
                acc = acc.concat(query_input_parameters(inner_param));
            }
            return acc;
        }, [])
    }
}