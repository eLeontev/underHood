import { ExpectedResult, MatchersCore } from './matcher.model';
import { TestsResults } from './runner.model';

export type Callback = () => void;
export type CallbackList = Array<Callback>;

export type DescribeModel = (description: string, callback: Callback) => void;
export interface DescribeCore {
    describe: DescribeModel;
}

export type BeforeAfterEachModel = (callback: Callback) => void;
export type ItModel = (description: string, callback: Callback) => void;
export interface InnerDescribeMethodsCore {
    beforeEach: BeforeAfterEachModel;
    afterEach: BeforeAfterEachModel;
    it: ItModel;
}

export type ExpectModel = (expectedResult: ExpectedResult) => MatchersCore;
export interface ExpectCore {
    expect: ExpectModel;
}

export type RunModel = () => TestsResults;
export interface RunCore {
    run: RunModel;
}

export type JasmineCore = DescribeCore &
    InnerDescribeMethodsCore &
    ExpectCore &
    RunCore;
