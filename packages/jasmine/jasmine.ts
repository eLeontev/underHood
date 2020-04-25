import {
    JasmineCore,
    DescribeModel,
    BeforeAfterEachModel,
} from './jasmine.model';
import { Describe } from './describe';
import { BeforeAfterEach } from './before-after.each';

export class Jasmine implements JasmineCore {
    public describe: DescribeModel;

    public beforeEach: BeforeAfterEachModel;
    public afterEach: BeforeAfterEachModel;

    constructor() {
        const describeInstance = new Describe();
        const beforeAfterEachInstance = new BeforeAfterEach();

        this.setProperties(describeInstance, beforeAfterEachInstance);
        this.setMethods(describeInstance, beforeAfterEachInstance);

        this.bindPublicApi();
    }

    private bindPublicApi(): void {
        this.afterEach = this.afterEach.bind(this);
        this.beforeEach = this.beforeEach.bind(this);
        this.describe = this.describe.bind(this);
    }

    private setMethods(
        describeInstance: Describe,
        beforeAfterEachInstance: BeforeAfterEach
    ): void {
        Object.assign(
            this,
            describeInstance.getMethods(),
            beforeAfterEachInstance.getMethods()
        );
    }

    private setProperties(
        describeInstance: Describe,
        beforeAfterEachInstance: BeforeAfterEach
    ): void {
        Object.assign(this, describeInstance, beforeAfterEachInstance);
    }

    // expect() {}
    // it() {}
}
