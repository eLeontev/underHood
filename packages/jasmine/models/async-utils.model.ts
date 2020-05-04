import { ValidatorResult } from './matchers.model';

/**
 * async map
 */
export type AsyncMapCallback<InitialElement, ResultElement> = (
    element: InitialElement,
    index?: number,
    list?: Array<InitialElement>
) => Promise<ResultElement>;

export type AsyncMap = <InitialElement, ResultElement>(
    list: Array<InitialElement>,
    asyncCallback: AsyncMapCallback<InitialElement, ResultElement>
) => Promise<Array<ResultElement>>;

/**
 * async reduce
 */
export type AsyncReduceCallback<Result, InitialElement> = (
    result: Result,
    element: InitialElement,
    index?: number,
    list?: Array<InitialElement>
) => Promise<Result>;

export type AsyncReduce = <InitialElement, Result>(
    list: Array<InitialElement>,
    asyncCallback: AsyncReduceCallback<Result, InitialElement>,
    initialResult: Result
) => Promise<Result>;

export type Resolve = (validatorResult: ValidatorResult) => void;
