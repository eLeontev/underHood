import {
    JasmineCore,
    DescribeModel,
    BeforeAfterEachModel,
    ItModel,
    ExpectModel,
    RunModel,
} from './jasmine.model';

import { Describe } from './describe';
import { InnerDescribeMethods } from './inner-describe.methods';
import { Expect } from './expect';
import { Runner } from './runner';
import { Store } from './store';

export class Jasmine implements JasmineCore {
    private store: Store = {
        activeDescriberId: null,
        isDescriberFormingInProgress: false,
        describers: {},
        rootDescribersId: [],
        activeTestCaseIndex: null,
        nextDescriberArguments: [],
    };

    public describe: DescribeModel;

    public beforeEach: BeforeAfterEachModel;
    public afterEach: BeforeAfterEachModel;

    public it: ItModel;

    public expect: ExpectModel;

    public run: RunModel;

    constructor() {
        this.setPublicApi(
            new Describe(this.store),
            new InnerDescribeMethods(this.store),
            new Expect(this.store),
            new Runner(this.store)
        );
    }

    private setPublicApi(
        describeInstance: Describe,
        innerDescribeMethodsInstance: InnerDescribeMethods,
        expectInstance: Expect,
        runnerInstance: Runner
    ): void {
        this.describe = describeInstance.describe;

        this.afterEach = innerDescribeMethodsInstance.afterEach;
        this.beforeEach = innerDescribeMethodsInstance.beforeEach;

        this.it = innerDescribeMethodsInstance.it;
        this.expect = expectInstance.expect;

        this.run = runnerInstance.run;
    }
}
