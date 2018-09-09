
import {ResultList, ResultListParser, Parser, Output, DataKind, DataType,
    TextOutput, MappingOutput, ListOutput, StaticValue, SimpleParser, Data} from "../schema";

import {type_cast2} from "./type_cast";
import {data_reduce, parser_has_simple_input, is_static_value, find_next_match} from "../utils";

import * as jmespath from "jmespath";
import * as mustache from "mustache";


/*
const expr_cache: {
    [expr: string]: XPathExpression
} = {}

function make_expr(expression: string, data: Document): XPathExpression {
    if (expr_cache[expression] !== undefined) {
        return expr_cache[expression];
    } else {
        let ns_resolver = data.createNSResolver(data.ownerDocument == null ? data.documentElement : data.ownerDocument.documentElement);
        let evalled_expr = document.createExpression(expression, ns_resolver);
        expr_cache[expression] = evalled_expr;
        return evalled_expr;
    }
}
*/

export function parse_xml(data: any, parser: Parser): Output|null {

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
            let ns_resolver = document.createNSResolver(data.ownerDocument == null ? data.documentElement : data.ownerDocument.documentElement);

            switch(parser.type) {
                case DataType.Text:
                    data = document.evaluate(parser.expression, data, ns_resolver, XPathResult.STRING_TYPE, null).stringValue;
                    if (data === "") data = null;
                    break;

                case DataType.Number:
                    data = document.evaluate(parser.expression, data, ns_resolver, XPathResult.NUMBER_TYPE, null).numberValue;
                    if (isNaN(data)) data = null;
                    break;

                case DataType.Boolean:
                    data = document.evaluate(parser.expression, data, ns_resolver, XPathResult.BOOLEAN_TYPE, null).booleanValue;
                    break;

                case DataType.Mapping:
                case DataType.Template:
                    data = document.evaluate(parser.expression, data, ns_resolver, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    break;

                case DataType.List:
                    data = document.evaluate(parser.expression, data, ns_resolver, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
                    break;

                default:
                    throw("Unhandled XML parser expression.")
            }
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
                        let value = parse_xml(data, parser);
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

            } else if (parser.type === DataType.Mapping) {
                
                let mapping = {};
                Object.entries(parser.mapping).forEach(([key, parser]) => {
                    if (parser !== undefined) {
                        let value = parse_xml(data, parser);
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
                // parser.type === DataType.List

                let list: Array<Output> = [];

                let this_node = data.iterateNext();
                while (this_node !== null) {
                    let item = parse_xml(this_node, parser.result_parser);
                    if (item !== null) {
                        list.push(item);
                    }
                    this_node = data.iterateNext();
                }

                return {
                    type: DataType.List,
                    list: list
                }
            }
        }
    }
}
