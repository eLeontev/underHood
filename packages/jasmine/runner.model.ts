import { ValidatorResults } from './matcher.model';
import { TestCase, Context } from './describe.model';

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

export interface InnerMethods {
    setActiveTestCaseIndex(index: number): void;
    setActiveDescriberId(describerId: string): void;
    performTestAndReturnItsResult(
        context: Context,
        { it, validators }: TestCase,
        index: number
    ): TestCaseResult;
    performTestsAndReturnTheirResults(
        testsResults: TestsResults,
        describerId: string
    ): TestsResults;
    performDecribers(
        describersIds: Array<string>,
        testsResults: TestsResults
    ): TestsResults;
    run(): TestsResults;
}
