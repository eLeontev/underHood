import {
    ExpectedResult,
    ActualResult,
    ValidatorResult,
} from './matchers.model';

export type ValidatorMethod = (
    actualResult: ActualResult,
    ...expectedResults: Array<ExpectedResult>
) => ValidatorResult;
