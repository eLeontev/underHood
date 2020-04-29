import { CallbackList, Callback, DescribeModel } from './jasmine.model';
import { Validator } from './matcher.model';

export interface It {
    description: string;
    callback: Callback;
}
export interface TestCase {
    it: It;
    validators: Array<Validator>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Context = any;

export interface Describer {
    description: string;
    beforeEachList: CallbackList;
    afterEachList: CallbackList;
    childrenDescribersId: Array<string>;
    testCases: Array<TestCase>;
    context: Context;
}

export interface Describers {
    [describerId: string]: Describer;
}

export interface NextDescriberArguments {
    description: string;
    callback: Callback;
}
