import {
    JasmineCore,
    DescribeModel,
    BeforeAfterEachModel,
    ItModel,
} from './jasmine.model';
import { Describe } from './describe';
import { InnerDescribeMethods } from './inner-describe.methods';

export class Jasmine implements JasmineCore {
    public describe: DescribeModel;

    public beforeEach: BeforeAfterEachModel;
    public afterEach: BeforeAfterEachModel;
    public it: ItModel;

    constructor() {
        const describeInstance = new Describe();
        const innerDescribeMethodsInstance = new InnerDescribeMethods();

        this.setProperties(describeInstance, innerDescribeMethodsInstance);
        this.setMethods(describeInstance, innerDescribeMethodsInstance);

        this.bindPublicApi();
    }

    private bindPublicApi(): void {
        this.afterEach = this.afterEach.bind(this);
        this.beforeEach = this.beforeEach.bind(this);
        this.it = this.it.bind(this);

        this.describe = this.describe.bind(this);
    }

    private setMethods(
        describeInstance: Describe,
        innerDescribeMethodsInstance: InnerDescribeMethods
    ): void {
        Object.assign(
            this,
            describeInstance.getMethods(),
            innerDescribeMethodsInstance.getMethods()
        );
    }

    private setProperties(
        describeInstance: Describe,
        innerDescribeMethodsInstance: InnerDescribeMethods
    ): void {
        Object.assign(this, describeInstance, innerDescribeMethodsInstance);
    }

    // expect() {}
}
