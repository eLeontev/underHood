import { InnerDescribeMethodsCore, Callback } from './models/jasmine.model';
import { Describer, It } from './models/describe.model';
import { Store } from './models/store.model';
import uniqueId from 'lodash.uniqueid';

export class InnerDescribeMethods implements InnerDescribeMethodsCore {
    constructor(private store: Store) {}

    public fit = (description: string, callback: Callback): void => {
        const describer = this.getActiveDescriber();
        const fDescriber = this.getFDescriber(describer, {
            description,
            callback,
        });

        this.registerFDescriber(fDescriber);
    };

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

    private getFDescriber(describer: Describer, it: It): Describer {
        return {
            ...describer,
            childrenDescribersId: [],
            context: {},
            testCases: [
                {
                    it,
                    validators: [],
                },
            ],
        };
    }

    private registerFDescriber(fDescriber: Describer): void {
        const { store } = this;
        const fDescriberId = uniqueId('fdescr-');

        store.describers = {
            ...store.describers,
            [fDescriberId]: fDescriber,
        };

        store.fDescribersId = [...store.fDescribersId, fDescriberId];
    }
}
