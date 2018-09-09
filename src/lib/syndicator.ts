import {Source, Query, Status, Parameter, FailureReason, Data, DataKind, DataType, MappingData,
    Format, API, Output, Result, TextOutput, TextParser, Syndicator, Protocol, ResultList,
    Parser, Results, TextData, TemplateParameter, MappingParameter, ListData, Queryable} from "../schema";


function consolidate_results(result_sets: Array<ListData>): Array<MappingData> {
    // combine results from all sources
    return result_sets.reduce((acc: Array<MappingData>, result_set) => {
        return acc.concat(<Array<MappingData>>result_set.list.filter(result=> result.type === DataType.Mapping))
    }, []);
}

export function search(
    query: Query,
    directory: Array<Queryable>,
    post_processors: Array<(Results) => Results>,
    update_progress: (Results) => void
): Promise<Results> {
    
    let request_start_time = performance.now();
    let results: Results = {
        list: [],
        details: directory.map((item: Queryable) => (<Status>{
            source: item.source,
            is_completed: false,
            is_success: false
        })),
        is_completed: false,
        request_build_time: 0,
        search_time: 0
    }

    update_progress(results);
    let search_start_time = performance.now();

    return Promise.all(directory.map((querier: Queryable, index): Promise<any> => {
        return querier.make_request(query)
        .then(resp => {
            let parsed = querier.parse_response(resp);
            (<ResultList>parsed).list = (<ResultList>parsed).list.map((value, index, array) => {
                value.source = {
                    name: querier.source.name,
                    id: querier.source.id
                }
                if (value.mapping.score === undefined) {
                    let score = (index + 1) / array.length;
                    if (querier.source.weight !== undefined) {
                        score *= querier.source.weight;
                    }
                    value.mapping.score = {
                        type: DataType.Number,
                        value: score
                    }
                }
                return value;
            })
            results.details[index].is_completed = true;
            results.details[index].is_success = parsed !== null;
            results.details[index].response = <Data>parsed;
            update_progress(results);
            return <Data>parsed;
        })
        .catch((err) => {
            results.details[index].is_completed = true;
            results.details[index].is_success = false;
            results.details[index].error = {
                reason: FailureReason.CouldntContactServer,
                message: err
            }
            update_progress(results);
            return <ListData>{
                list: [],
                type: DataType.List
            };
        })
    }))
    .then((result_sets: Array<ListData>): Results => {
        return {
            list: consolidate_results(result_sets),
            details: results.details,
            is_completed: true,
            search_time: performance.now() - search_start_time
        }
    })
    .then((results): Results => {
        // Send results through all post processors.
        return post_processors.reduce((acc, proc) => proc(acc), results)
    })
}
