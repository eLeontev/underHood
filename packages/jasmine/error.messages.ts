import {
    ErrorMessageCallback,
    ErrorMessages,
} from './models/error.messages.model';
import { ExpectedResult } from './models/matcher.model';

const expectDoNothing: ErrorMessageCallback = (
    expectedResult: ExpectedResult
) =>
    `looks like this expect does nothing with: ${JSON.stringify(
        expectedResult
    )}`;
const toBeFalsy: ErrorMessageCallback = (expectedResult: ExpectedResult) =>
    `expected ${JSON.stringify(expectedResult)} to be falsy`;
const toBeTruthly: ErrorMessageCallback = (expectedResult: ExpectedResult) =>
    `expected ${JSON.stringify(expectedResult)} to be truthly`;

export const errorMessages: ErrorMessages = {
    expectDoNothing,
    toBeFalsy,
    toBeTruthly,
};
