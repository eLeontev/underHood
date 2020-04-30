export interface ValidatorResult {
    isSuccess: boolean;
    errorMessage?: string;
}
export type ValidatorResults = Array<ValidatorResult>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExpectedResult = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActualResult = any;
export type ValidatorCallback = () => ValidatorResult;

export interface Validator {
    expectedResult: ExpectedResult;
    validatorResult: ValidatorResult;
}

export interface MatchersCore {
    toBeTruthy(): void;
    toBeFalsy(): void;
}
