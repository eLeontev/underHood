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

export class Jasmine implements JasmineCore {
    public describe: DescribeModel;

    public beforeEach: BeforeAfterEachModel;
    public afterEach: BeforeAfterEachModel;

    public it: ItModel;

    public expect: ExpectModel;

    public run: RunModel;

    constructor() {
        const describeInstance = new Describe();
        const innerDescribeMethodsInstance = new InnerDescribeMethods();
        const expectInstance = new Expect();
        const runnerInstance = new Runner();

        this.setProperties(
            describeInstance,
            innerDescribeMethodsInstance,
            expectInstance,
            runnerInstance
        );
        this.setMethods(
            describeInstance,
            innerDescribeMethodsInstance,
            expectInstance,
            runnerInstance
        );

        this.bindPublicApi();
    }

    private bindPublicApi(): void {
        this.afterEach = this.afterEach.bind(this);
        this.beforeEach = this.beforeEach.bind(this);

        this.it = this.it.bind(this);
        this.expect = this.expect.bind(this);

        this.describe = this.describe.bind(this);

        this.run = this.run.bind(this);
    }

    private setMethods(
        describeInstance: Describe,
        innerDescribeMethodsInstance: InnerDescribeMethods,
        expectInstance: Expect,
        runnerInstance: Runner
    ): void {
        Object.assign(
            this,
            describeInstance.getMethods(),
            innerDescribeMethodsInstance.getMethods(),
            expectInstance.getMethods(),
            runnerInstance.getMethods()
        );
    }

    private setProperties(
        describeInstance: Describe,
        innerDescribeMethodsInstance: InnerDescribeMethods,
        expectInstance: Expect,
        runnerInstance: Runner
    ): void {
        Object.assign(
            this,
            describeInstance,
            innerDescribeMethodsInstance,
            expectInstance,
            runnerInstance
        );
    }

    // expect() {}
}
