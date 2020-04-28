import { InnerDescribeMethodsCore, Callback } from './jasmine.model';
import { Describers, Describer } from './describe.model';
import { InnerMethods } from './inner-describe.methods.model';

export class InnerDescribeMethods implements InnerDescribeMethodsCore {
    private describers: Describers = {};
    private activeDescriberId: string;

    public beforeEach(callback: Callback): void {
        const describer = this.getActiveDescriber();
        describer.beforeEachList = [...describer.beforeEachList, callback];
    }

    public afterEach(callback: Callback): void {
        const describer = this.getActiveDescriber();
        describer.afterEachList = [...describer.afterEachList, callback];
    }

    public it(description: string, callback: Callback): void {
        const describer = this.getActiveDescriber();
        describer.testCases = [
            ...describer.testCases,
            {
                it: {
                    description,
                    callback,
                },
                validators: [],
            },
        ];
    }

    private getActiveDescriber(): Describer {
        const { activeDescriberId, describers } = this;
        return describers[activeDescriberId];
    }

    public getMethods(): InnerMethods {
        return {
            it: this.it,
            beforeEach: this.beforeEach,
            afterEach: this.afterEach,
            getActiveDescriber: this.getActiveDescriber,
        };
    }
}
