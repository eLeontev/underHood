import {
    ErrorMessageCallback,
    ErrorMessages,
} from './models/error.messages.model';
import { ExpectedResult } from './models/matcher.model';

export const expectDoNothing: ErrorMessageCallback = (
    expectedResult: ExpectedResult
) =>
    `looks like this expect does nothing with: ${JSON.stringify(
        expectedResult
    )}`;
export const toBeFalsy: ErrorMessageCallback = (
    expectedResult: ExpectedResult
) => `expected ${JSON.stringify(expectedResult)} to be falsy`;
export const toBeTruthy: ErrorMessageCallback = (
    expectedResult: ExpectedResult
) => `expected ${JSON.stringify(expectedResult)} to be truthy`;

export const errorMessages: ErrorMessages = {
    expectDoNothing,
    toBeFalsy,
    toBeTruthy,
};
