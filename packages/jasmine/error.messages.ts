import {
    ErrorMessageCallback,
    ErrorMessages,
    GetErrorMessage,
} from './models/error.messages.model';
import { ExpectedResult, ActualResult } from './models/matchers.model';

export const expectDoNothing: ErrorMessageCallback = (
    actualResult: ActualResult
) =>
    `looks like this expect does nothing with: ${JSON.stringify(actualResult)}`;
export const toBeFalsy: ErrorMessageCallback = (actualResult: ActualResult) =>
    `expected ${JSON.stringify(actualResult)} to be falsy`;
export const toBeTruthy: ErrorMessageCallback = (actualResult: ActualResult) =>
    `expected ${JSON.stringify(actualResult)} to be truthy`;

export const errorMessages: ErrorMessages = {
    expectDoNothing,
    toBeFalsy,
    toBeTruthy,
};

export const getErrorMessage: GetErrorMessage = (
    isSuccess: boolean,
    errorMessageCallback: ErrorMessageCallback,
    actualResult: ActualResult,
    expectedResult?: ExpectedResult
): string =>
    isSuccess ? '' : errorMessageCallback(actualResult, expectedResult);
