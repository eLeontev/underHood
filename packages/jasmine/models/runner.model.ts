import { ValidatorResults } from './matchers.model';

export interface TestCaseResult {
    itDescription: string;
    validatorResults: ValidatorResults;
}
export type TestCaseResults = Array<TestCaseResult>;

export interface TestResults {
    description: string;
    testCaseResults: Array<TestCaseResult>;
}
export type TestsResults = Array<TestResults>;

export interface DisabledMethods {
    describers: Array<string>;
    testCases: Array<string>;
}

export interface TestResultsWithDisabledMethods {
    testsResults: TestsResults;
    disabledMethods: DisabledMethods;
}
