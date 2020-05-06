import { InnerDescribeMethodsCore, Callback } from './models/jasmine.model';
import { Describer } from './models/describe.model';
import { Store } from './models/store.model';

export class InnerDescribeMethods implements InnerDescribeMethodsCore {
    constructor(private store: Store) {}

    public xit = (description: string): void => {
        const { store } = this;
        store.inactiveTestCases = [...store.inactiveTestCases, description];
    };

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
