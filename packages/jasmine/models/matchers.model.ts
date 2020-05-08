import { ErrorMessageCallback } from './error.messages.model';

export interface ValidatorResult {
    isSuccess: boolean;
    errorMessage?: string;
}
export type ValidatorResults = Array<ValidatorResult>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExpectedResult = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActualResult = any;

export interface Validator {
    actualResult: ActualResult;
    validatorResult: ValidatorResult;
}

export type MatcherMethod = (...expectedResult: Array<ExpectedResult>) => void;
export interface MatchersCore {
    not: MatchersCore;
    toBeTruthy: MatcherMethod;
    toBeFalsy: MatcherMethod;
}

export interface VaidatorResultWithErrorCallback {
    isSuccess: boolean;
    errorMessageCallback: ErrorMessageCallback;
}
