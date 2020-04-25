import { CallbackList, Callback } from './jasmine.model';

export interface Describer {
    description: string;
    beforeEachList: CallbackList;
    afterEachList: CallbackList;
    childrenDescribersId: Array<string>;
    itList: CallbackList;
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
