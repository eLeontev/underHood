import { ExpectedResult, ActualResult } from './matchers.model';

export type ValidatorMethod = (
    actualResult: ActualResult,
    ...expectedResults: Array<ExpectedResult>
) => boolean;
