import { JasmineCore, DescribeModel } from './jasmine.model';
import { Describe } from './describe';

export class Jasmine implements JasmineCore {
    public describe: DescribeModel;

    constructor() {
        Object.assign(this, new Describe());
    }

    // beforeEach() {}
    // expect() {}
    // it() {}
}
