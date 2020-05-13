import { CallbackList, Callback } from './jasmine.model';
import { Validator } from './matchers.model';

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
    isFDescribe: boolean;
}

export interface Describers {
    [describerId: string]: Describer;
}

export interface ParentMethods {
    beforeEachList: CallbackList;
    afterEachList: CallbackList;
}

export interface DescriberArguments {
    description: string;
    callback: Callback;
    parentMethods?: ParentMethods;
    isFDescribe?: boolean;
}
