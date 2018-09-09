/**
 * Whew, this is a doozy. Sorry. The code is verbose and opaque,
 * but I think the business logic is fairly straightforward. I
 * think this would be drastically improved with generic data
 * structures.
 */

import {Parameter, Data, Query, DataType, DataKind, SimpleData} from "../schema";
import {data_reduce} from "../utils";

import {type_cast2} from "./type_cast";

import * as mustache from "mustache";

export function resolve_parameter(
    param: Parameter,
    fields: Query["fields"],
    overrides?: {[name: string]: SimpleData}
): Data | null {
    let result: Data|null = null;

    if (param.type === DataType.Text) {
        if (param.kind === DataKind.Static) {
            if (param.value !== undefined) {
                result = {
                    type: param.type,
                    value: param.value
                }
            }
        } else if (overrides && overrides[ param.name ] !== undefined) {
            let value = type_cast2(overrides[ param.name ].value, param.type);
            if (value !== null) {
                result = {
                    type: param.type,
                    value: value
                }
            }
        } else if (fields[ param.name ] !== undefined) {
            let value = type_cast2(fields[ param.name ].value, param.type);
            if (value !== null) {
                result = {
                    type: param.type,
                    value: value
                }
            }
        }
    } else if (param.type === DataType.Number) {
        if (param.kind === DataKind.Static) {
            if (param.value !== undefined) {
                result = {
                    type: param.type,
                    value: param.value
                }
            }
        } else if (overrides && overrides[ param.name ] !== undefined) {
            let value = type_cast2(overrides[ param.name ].value, param.type);
            if (value !== null) {
                result = {
                    type: param.type,
                    value: value
                }
            }
        } else if (fields[ param.name ] !== undefined) {
            let value = type_cast2(fields[ param.name ].value, param.type);
            if (value !== null) {
                result = {
                    type: param.type,
                    value: value
                }
            }
        }
    } else if (param.type === DataType.Boolean) {
        if (param.kind === DataKind.Static) {
            if (param.value !== undefined) {
                result = {
                    type: param.type,
                    value: param.value
                }
            }
        } else if (overrides && overrides[ param.name ] !== undefined) {
            let value = type_cast2(overrides[ param.name ].value, param.type);
            if (value !== null) {
                result = {
                    type: param.type,
                    value: value
                }
            }
        } else if (fields[ param.name ] !== undefined) {
            let value = type_cast2(fields[ param.name ].value, param.type);
            if (value !== null) {
                result = {
                    type: param.type,
                    value: value
                }
            }
        }
    } else if (param.type === DataType.Template) {
        let lookup = {};
        Object.entries(param.lookup).forEach(([key, inner_param]) => {
            if (inner_param !== undefined) {
                let value = resolve_parameter(inner_param, fields, overrides);
                if (value !== null) {
                    lookup[key] = data_reduce(value);
                }
            }
        })
        return {
            type: DataType.Text,
            value: mustache.render(param.template, lookup)
        }
    } else if (param.type === DataType.Mapping) {
        let mapping = {};
        Object.entries(param.mapping).forEach(([key, inner_param]) => {
            if (inner_param !== undefined) {
                let value = resolve_parameter(inner_param, fields, overrides);
                if (value !== null) {
                    mapping[key] = value;
                }
            }
        })
        return {
            type: DataType.Mapping,
            mapping: mapping
        }
    } else if (param.type === DataType.List) {
        let list: Array<Data> = [];
        param.list.forEach(inner_param => {
            let value = resolve_parameter(inner_param, fields, overrides);
            if (value !== null) {
                list.push(value);
            }
        })
        return {
            type: DataType.List,
            list: list
        }
    }

    return result;
}