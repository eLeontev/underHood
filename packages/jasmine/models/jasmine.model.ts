import { MatchersCore, ActualResult } from './matchers.model';
import { TestResultsWithDisabledMethods } from './runner.model';

export type Callback = () => void;
export type CallbackList = Array<Callback>;

export type DescribeModel = (description: string, callback: Callback) => void;
export interface DescribeCore {
    describe: DescribeModel;
    xdescribe: DescribeModel;
}

export type BeforeAfterEachModel = (callback: Callback) => void;
export type ItModel = (description: string, callback: Callback) => void;
export interface InnerDescribeMethodsCore {
    beforeEach: BeforeAfterEachModel;
    afterEach: BeforeAfterEachModel;
    it: ItModel;
    xit: ItModel;
    fit: ItModel;
}

export type ExpectModel = (actualResult: ActualResult) => MatchersCore;
export interface ExpectCore {
    expect: ExpectModel;
}

export type RunModel = () => Promise<TestResultsWithDisabledMethods>;
export interface RunCore {
    run: RunModel;
}

export type JasmineCore = DescribeCore &
    InnerDescribeMethodsCore &
    ExpectCore &
    RunCore;
