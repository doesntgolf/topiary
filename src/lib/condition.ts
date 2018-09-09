import {DataType, Condition} from "../schema";

export function test_condition<T extends DataType|null>(condition: Condition): boolean {
    let result = true;

    switch(condition.type) {
        case DataType.Text:
            switch(condition.operation.operator) {
                case "Is":
                    result = condition.input.value === condition.operation.operand!.value;
                    break;
                case "IsNot":
                    result = condition.input.value !== condition.operation.operand!.value;
                    break;
                case "BeginsWith":
                    result = (<string>condition.operation.operand!.value).startsWith((<string>condition.input.value));
                    break;
                case "DoesNotBeginWith":
                    result = !(<string>condition.operation.operand!.value).startsWith((<string>condition.input.value));
                    break;
                case "EndsWith":
                    result = (<string>condition.operation.operand!.value).endsWith((<string>condition.input.value));
                    break;
                case "DoesNotEndWith":
                    result = !(<string>condition.operation.operand!.value).endsWith((<string>condition.input.value));
                    break;
                case "Contains":
                    result = (<string>condition.operation.operand!.value).includes((<string>condition.input.value));
                    break;
                case "DoesNotContain":
                    result = !(<string>condition.operation.operand!.value).includes((<string>condition.input.value));
                    break;
                case "RegExpMatch":
                case "LongerThan":
                    result = (<string>condition.operation.operand!.value).length > (<string>condition.input.value).length;
                    break;
                case "ShorterThan":
                    result = (<string>condition.operation.operand!.value).length < (<string>condition.input.value).length;
                    break;
                case "IsLength":
                    result = (<string>condition.operation.operand!.value).length === (<string>condition.input.value).length;
                    break;
                default:
                    throw new Error(`Unhandled text operator: ${condition.operation}`);
            }

        case DataType.Number:
        case DataType.Boolean:
        case DataType.List:
        case DataType.Mapping:
        case null:
        default:
            throw new Error("Unknown value type.")
    }
    
    if (result === true) {
        return condition.and.every(test_condition) || condition.or.some(test_condition);
    } else {
        return condition.or.some(test_condition);
    }
}