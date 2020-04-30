import { Describe } from './describe';
import { InnerDescribeMethods } from './inner-describe.methods';
import { Expect } from './expect';
import { Runner } from './runner';
import { store } from './store';

import {
    JasmineCore,
    DescribeModel,
    BeforeAfterEachModel,
    ItModel,
    ExpectModel,
    RunModel,
} from './models/jasmine.model';
import { Store } from './models/store.model';

export class Jasmine implements JasmineCore {
    private store: Store = {
        ...store,
        describers: {},
        rootDescribersId: [],
        nextDescriberArguments: [],
    };

    public describe: DescribeModel;

    public beforeEach: BeforeAfterEachModel;
    public afterEach: BeforeAfterEachModel;

    public it: ItModel;

    public expect: ExpectModel;

    public run: RunModel;

    constructor() {
        const describeInstance = new Describe(this.store);
        this.describe = describeInstance.describe;

        const innerDescribeMethodsInstance = new InnerDescribeMethods(
            this.store
        );
        this.afterEach = innerDescribeMethodsInstance.afterEach;
        this.beforeEach = innerDescribeMethodsInstance.beforeEach;

        this.it = innerDescribeMethodsInstance.it;

        const expectInstance = new Expect(this.store);
        this.expect = expectInstance.expect;

        const runnerInstance = new Runner(this.store);

        this.run = runnerInstance.run;
    }
}
