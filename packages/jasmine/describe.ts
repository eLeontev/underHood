import uniqueid from 'lodash.uniqueid';

import { Callback, DescribeCore } from './jasmine.model';
import {
    NextDescriberArguments,
    Describer,
    InnerMethods,
} from './describe.model';
import { Store } from './store';

export class Describe implements DescribeCore {
    constructor(private store: Store) {}

    public describe = (description: string, callback: Callback): void => {
        this.describeHandler(description, callback);
    };

    private childDescribe(
        description: string,
        callback: Callback,
        describerId: string
    ): void {
        this.describeHandler(description, callback, describerId);
    }

    private describeHandler(
        description: string,
        callback: Callback,
        describerId?: string
    ): void {
        const {
            isDescriberFormingInProgress,
            nextDescriberArguments,
        } = this.store;

        if (isDescriberFormingInProgress) {
            this.store.nextDescriberArguments = [
                ...nextDescriberArguments,
                { description, callback },
            ];

            return;
        }

        this.beforeCallbackCall(description, describerId);
        callback();
        this.afterCallbackCall();
    }

    private beforeCallbackCall(description: string, describerId: string): void {
        const { store } = this;
        store.activeDescriberId = this.initDescribe(description, describerId);
        store.isDescriberFormingInProgress = true;
    }

    private afterCallbackCall(): void {
        const { store } = this;
        const { activeDescriberId } = store;

        store.activeDescriberId = null;
        store.isDescriberFormingInProgress = false;

        this.performChildrenDescribers(activeDescriberId);
    }

    private initDescribe(description: string, describerId?: string): string {
        const id = describerId || uniqueid('root-');
        const describer: Describer = {
            description,
            beforeEachList: [],
            afterEachList: [],
            testCases: [],
            childrenDescribersId: [],
            context: {},
        };

        const isRootDescriber = !describerId;
        this.setFormedDescriber(describer, id, isRootDescriber);

        return id;
    }

    private performChildrenDescribers(describerId: string): void {
        const nextDescriberArguments = [...this.store.nextDescriberArguments];
        this.store.nextDescriberArguments = [];

        nextDescriberArguments.forEach(
            ({ description, callback }: NextDescriberArguments) => {
                const childDescriberId = uniqueid('child-');

                this.addChildDesriberId(describerId, childDescriberId);
                this.childDescribe(description, callback, childDescriberId);
            }
        );
    }

    private setFormedDescriber(
        describer: Describer,
        describerId: string,
        isRootDescriber: boolean
    ): void {
        const { store } = this;

        if (isRootDescriber) {
            store.rootDescribersId = [...store.rootDescribersId, describerId];
        }

        store.describers = {
            ...store.describers,
            [describerId]: describer,
        };
    }

    private addChildDesriberId(
        describerId: string,
        childDescriberId: string
    ): void {
        const describer = this.store.describers[describerId];

        describer.childrenDescribersId = [
            ...describer.childrenDescribersId,
            childDescriberId,
        ];
    }

    public getMethods(): InnerMethods {
        return {
            addChildDesriberId: this.addChildDesriberId,
            setFormedDescriber: this.setFormedDescriber,
            performChildrenDescribers: this.performChildrenDescribers,
            initDescribe: this.initDescribe,
            afterCallbackCall: this.afterCallbackCall,
            beforeCallbackCall: this.beforeCallbackCall,
            describeHandler: this.describeHandler,
            childDescribe: this.childDescribe,
            describe: this.describe,
        };
    }
}
