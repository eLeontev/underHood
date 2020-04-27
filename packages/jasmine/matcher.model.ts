export interface ValidatorResult {
    isSuccess: boolean;
    errorMessage?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExpectedResult = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActualResult = any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValidatorCallback = (...args: any) => ValidatorResult;

export interface Validator {
    expectedResult: ExpectedResult;
    validatorCallback: ValidatorCallback;
}

export interface MatchersCore {
    toBeTruthly(): void;
    toBeFalsy(): void;
}
