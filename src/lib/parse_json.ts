import {ResultList, ResultListParser, Parser, Output, DataKind, DataType,
    TextOutput, MappingOutput, ListOutput, StaticValue, SimpleParser, Data} from "../schema";

import {type_cast2} from "./type_cast";
import {data_reduce, is_static_value, parser_has_simple_input, find_next_match} from "../utils";

import * as jmespath from "jmespath";
import * as mustache from "mustache";


export function parse_json(data: any, parser: Parser): Output|null {
    if (is_static_value(parser)) {

        // This sucks. I think if these were generic tsc would be
        // able to type check them correctly without doing this.
        if (parser.type === DataType.Text) {
            return {
                type: parser.type,
                value: parser.value
            }
        } else if (parser.type === DataType.Number) {
            return {
                type: parser.type,
                value: parser.value
            }
        } else {
            return {
                type: parser.type,
                value: parser.value
            }
        }

    } else {

        if (parser.expression) {
            data = jmespath.search(data, parser.expression);
            if (data === null) {return null};
        }

        if (parser_has_simple_input(parser)) {

            let value = type_cast2(data, parser.type);
            if (value === null) {
                return null;
            } else {
                
                // This sucks. I think if these were generic tsc would be
                // able to type check them correctly without doing this.
                if (parser.type === DataType.Text) {
                    let field = <TextOutput>{
                        type: DataType.Text,
                        value: <string>value
                    }
                    field = find_next_match(field, parser);
                    return field;
                } else if (parser.type === DataType.Number) {
                    return {
                        type: DataType.Number,
                        value: <number>value
                    }
                } else {
                    return {
                        type: DataType.Boolean,
                        value: <boolean>value
                    }
                }
            }

        } else {

            if (parser.type === DataType.Template) {
                let lookup = {};
                Object.entries(parser.lookup).forEach(([key, parser]) => {
                    if (parser !== undefined) {
                        let value = parse_json(data, parser);
                        if (value !== null) {
                            lookup[key] = data_reduce(value);
                        }
                    }
                })

                let value = mustache.render(parser.template, lookup);

                return {
                    type: DataType.Text,
                    value: value
                }

            } else {

                if (parser.type === DataType.Mapping) {
                    let mapping = {};
                    Object.entries(parser.mapping).forEach(([key, parser]) => {
                        if (parser !== undefined) {
                            let value = parse_json(data, parser);
                            if (value !== null) {
                                mapping[key] = value;
                            }
                        }
                    })

                    return {
                        type: DataType.Mapping,
                        mapping: mapping
                    }
                    
                } else {
                    
                    // List parser
                    if (!Array.isArray(data)) {
                        data = [data];
                    }

                    return {
                        type: DataType.List,
                        list: data
                            .map(item => parse_json(item, parser.result_parser))
                            .filter(item => item !== null)
                    }
                }
            }
        }
    }
}