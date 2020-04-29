import { InnerDescribeMethodsCore, Callback } from './jasmine.model';
import { Describer } from './describe.model';
import { Store } from './store';

export class InnerDescribeMethods implements InnerDescribeMethodsCore {
    constructor(private store: Store) {}

    public beforeEach = (callback: Callback): void => {
        const describer = this.getActiveDescriber();
        describer.beforeEachList = [...describer.beforeEachList, callback];
    };

    public afterEach = (callback: Callback): void => {
        const describer = this.getActiveDescriber();
        describer.afterEachList = [...describer.afterEachList, callback];
    };

    public it = (description: string, callback: Callback): void => {
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
    };

    private getActiveDescriber(): Describer {
        const { activeDescriberId, describers } = this.store;
        return describers[activeDescriberId];
    }
}
