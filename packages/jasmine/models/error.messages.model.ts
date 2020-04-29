import { ExpectedResult, ActualResult } from './matcher.model';
import { MatchersTypes } from '../matcher';

export type ErrorMessageCallback = (
    expectedResult: ExpectedResult,
    actualResult?: ActualResult
) => string;

export type ErrorMessages = {
    [matcherType in MatchersTypes]: ErrorMessageCallback;
};
