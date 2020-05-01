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
