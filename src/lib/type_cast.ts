import {Data, DataType} from "../schema";

export function type_cast(source: Data, target: DataType): Data|null {
    if (source.type === target) {
        return source;
    } else {
        switch(target) {

            case DataType.Text:

                switch(source.type) {
                    case DataType.Number || DataType.Boolean:
                        return {
                            type: DataType.Text,
                            value: String(source.value)
                        }

                    default:
                        return null;
                }
    
            case DataType.Number:

                switch(source.type) {
                    
                    case DataType.Text:
                        const parsed = Number(source.value);
                        if (isNaN(parsed)) {
                            return null;
                        } else {
                            return {
                                type: DataType.Number,
                                value: parsed
                            }
                        }

                    default:
                        return null;
                }
    
            case DataType.Boolean:

                switch(source.type) {
                    case DataType.Text:
                        if (source.value === "true") {
                            return {
                                type: DataType.Boolean,
                                value: true
                            }
                        } else if (source.value === "false") {
                            return {
                                type: DataType.Boolean,
                                value: false
                            }
                        } else {
                            return null;
                        }

                    default:
                        return null;
                }
                
            case DataType.List:
                return {
                    type: DataType.List,
                    list: [source]
                }

            case DataType.Mapping:
                return null;
                
            default:
                return null;
        }
    }
}




export function type_cast2<T extends DataType.Text|DataType.Number|DataType.Boolean>(
    data: any,  
    target: T
) : (
    T extends DataType.Text ? string :
    T extends DataType.Number ? number :
    T extends DataType.Boolean ? boolean :
    null
) | null {

    switch(target) {
        case DataType.Text:

            if (typeof(data) !== "string") {
                data = String(data);
            }
            return data;


        case DataType.Number:

            if (isNaN(data)) {
                data = Number(data);
                if (isNaN(data)) {
                    return null;
                }
            }
            return data;

        case DataType.Boolean:
            data = !!data;
            return data;
    
        default:
            return null;
    }
}