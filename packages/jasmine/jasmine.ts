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
        inactiveDescribers: [],
        inactiveTestCases: [],
    };

    public fdescribe: DescribeModel;
    public describe: DescribeModel;
    public xdescribe: DescribeModel;

    public beforeEach: BeforeAfterEachModel;
    public afterEach: BeforeAfterEachModel;

    public it: ItModel;
    public xit: ItModel;
    public fit: ItModel;

    public expect: ExpectModel;

    public run: RunModel;

    constructor() {
        const describeInstance = new Describe(this.store);
        this.fdescribe = describeInstance.fdescribe;
        this.describe = describeInstance.describe;
        this.xdescribe = describeInstance.xdescribe;

        const innerDescribeMethodsInstance = new InnerDescribeMethods(
            this.store
        );
        this.afterEach = innerDescribeMethodsInstance.afterEach;
        this.beforeEach = innerDescribeMethodsInstance.beforeEach;

        this.it = innerDescribeMethodsInstance.it;
        this.xit = innerDescribeMethodsInstance.xit;
        this.fit = innerDescribeMethodsInstance.fit;

        const expectInstance = new Expect(this.store);
        this.expect = expectInstance.expect;

        const runnerInstance = new Runner(this.store);

        this.run = runnerInstance.run;
    }
}
