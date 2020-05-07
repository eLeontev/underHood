import {
    ErrorMessageCallback,
    ErrorMessages,
    GetErrorMessage,
} from './models/error.messages.model';
import { ExpectedResult, ActualResult } from './models/matchers.model';

export const getNotMessage = (isNot: boolean): string =>
    isNot ? ' not ' : ' ';

export const testTimeFrameDurationExeeded: ErrorMessageCallback = (
    isNot: boolean,
    actualResult: ActualResult
) => `async test takes more than available ${JSON.stringify(actualResult)}ms`;

export const expectDoNothing: ErrorMessageCallback = (
    isNot: boolean,
    actualResult: ActualResult
) =>
    `looks like this expect does nothing with: ${JSON.stringify(actualResult)}`;

export const toBeFalsy: ErrorMessageCallback = (
    isNot: boolean,
    actualResult: ActualResult
) =>
    `expected ${JSON.stringify(actualResult)}${getNotMessage(
        isNot
    )}to be falsy`;

export const toBeTruthy: ErrorMessageCallback = (
    isNot: boolean,
    actualResult: ActualResult
) =>
    `expected ${JSON.stringify(actualResult)}${getNotMessage(
        isNot
    )}to be truthy`;

export const toBe: ErrorMessageCallback = (
    isNot: boolean,
    actualResult: ActualResult,
    [expectedResult]: Array<ExpectedResult>
) =>
    `expected ${JSON.stringify(actualResult)}${getNotMessage(
        isNot
    )}to be ${JSON.stringify(expectedResult)}`;

export const toEqual: ErrorMessageCallback = (
    isNot: boolean,
    actualResult: ActualResult,
    [expectedResult]: Array<ExpectedResult>
) =>
    `expected ${JSON.stringify(actualResult)}${getNotMessage(
        isNot
    )}to equal ${JSON.stringify(expectedResult)}`;

export const toHaveBeenCalled: ErrorMessageCallback = (
    isNot: boolean,
    actualResult: ActualResult
) =>
    `expected ${JSON.stringify(actualResult)}${getNotMessage(
        isNot
    )}to have been called`;

export const toHaveBeenCalledWith: ErrorMessageCallback = (
    isNot: boolean,
    actualResult: ActualResult,
    ...expectedResult: Array<ExpectedResult>
) =>
    `expected ${JSON.stringify(actualResult)}${getNotMessage(
        isNot
    )}to have been called with ${JSON.stringify(expectedResult)}`;

export const expectSpy: ErrorMessageCallback = (
    isNot: boolean,
    actualResult: ActualResult
) => `expected spy but got ${JSON.stringify(actualResult)}`;

export const errorMessages: ErrorMessages = {
    expectSpy,
    testTimeFrameDurationExeeded,
    expectDoNothing,
    toBeFalsy,
    toBeTruthy,
    toBe,
    toEqual,
    toHaveBeenCalled,
    toHaveBeenCalledWith,
};

export const getErrorMessage: GetErrorMessage = (
    isSuccess: boolean,
    errorMessageCallback: ErrorMessageCallback,
    isNot: boolean,
    actualResult: ActualResult,
    ...expectedResult: Array<ExpectedResult>
): string =>
    isSuccess ? '' : errorMessageCallback(isNot, actualResult, expectedResult);
