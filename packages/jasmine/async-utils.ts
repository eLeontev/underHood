import {
    AsyncMap,
    AsyncMapCallback,
    AsyncReduce,
    AsyncReduceCallback,
} from './models/async-utils.model';

export const asyncMap: AsyncMap = async <InitialElement, ResultElement>(
    list: Array<InitialElement>,
    cb: AsyncMapCallback<InitialElement, ResultElement>
): Promise<Array<ResultElement>> => {
    const result: Array<ResultElement> = [];

    for (let i = 0; i < list.length; i++) {
        const element = await cb(list[i], i, list);
        result.push(element);
    }

    return result;
};

export const asyncReduce: AsyncReduce = async <Result, InitialElement>(
    list: Array<InitialElement>,
    cb: AsyncReduceCallback<Result, InitialElement>,
    initialResult: Result
): Promise<Result> => {
    let result: Result = initialResult;

    for (let i = 0; i < list.length; i++) {
        result = await cb(result, list[i], i, list);
    }

    return result;
};
