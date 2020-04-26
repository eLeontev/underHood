import { CallbackList, Callback, DescribeModel } from './jasmine.model';

export interface It {
    description: string;
    callback: Callback;
}
export interface Describer {
    description: string;
    beforeEachList: CallbackList;
    afterEachList: CallbackList;
    childrenDescribersId: Array<string>;
    itList: Array<It>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context: any;
}

export interface Describers {
    [describerId: string]: Describer;
}

export interface NextDescriberArguments {
    description: string;
    callback: Callback;
}

export interface InnerMethods {
    describe: DescribeModel;
    addChildDesriberId(describerId: string, childDescriberId: string): void;
    setFormedDescriber(
        describer: Describer,
        describerId: string,
        isRootDescriber: boolean
    ): void;
    performChildrenDescribers(describerId: string): void;
    initDescribe(description: string, describerId?: string): string;
    afterCallbackCall(): void;
    beforeCallbackCall(description: string, describerId: string): void;
    describeHandler(
        description: string,
        callback: Callback,
        describerId?: string
    ): void;
    childDescribe(
        description: string,
        callback: Callback,
        describerId: string
    ): void;
}
