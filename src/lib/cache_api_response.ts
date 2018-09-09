import {Data, DataType, SimpleData, ListData, MappingData, SourceID} from "../schema";
import {data_are_equal} from "../utils";


const parameter_cache: Array<{
    source: SourceID,
    cache: Array<{
        data: Data,
        response: any
    }>
}> = [];

export function cache_param(
    source: SourceID,
    cache: {
        data: Data,
        response: any
    }
): void {
    let source_cache = parameter_cache.find(item => {
        return item.source.key === source.key && item.source.directory_key === source.directory_key;
    })

    if (source_cache === undefined) {
        parameter_cache.push({
            source: source,
            cache: [cache]
        })
    } else {
        let cache_hit = source_cache.cache.find(item => {
            return data_are_equal(item.data, cache.data);
        })

        if (cache_hit === undefined) {
            source_cache.cache.push(cache);
        } else {
            cache_hit.response = cache.response;
        }
    }
}

export function check_param_cache(
    source: SourceID,
    input: Data
): any|null {
    let source_cache = parameter_cache.find(item => {
        return item.source.key === source.key && item.source.directory_key === source.directory_key;
    })

    if (source_cache === undefined) {
        return null;
    } else {
        let cache_hit = source_cache.cache.find(item => data_are_equal(item.data, input));

        if (cache_hit === undefined) {
            return null;
        } else {
            return cache_hit.response;
        }
    }
}