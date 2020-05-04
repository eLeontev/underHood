import { ExpectedResult, ActualResult } from './matchers.model';
import { MatchersTypes } from '../matchers';

export type ErrorMessageCallback = (
    isNot: boolean,
    expectedResult: ExpectedResult,
    actualResult?: ActualResult
) => string;

export type ErrorMessages = {
    [matcherType in MatchersTypes]: ErrorMessageCallback;
};

export type GetErrorMessage = (
    isSuccess: boolean,
    errorMessageCallback: ErrorMessageCallback,
    isNot: boolean,
    expectedResult: ExpectedResult,
    actualResult?: ActualResult
) => string;
