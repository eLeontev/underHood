import uniqueid from 'lodash.uniqueid';

import { Callback, DescribeCore } from './models/jasmine.model';
import {
    DescriberArguments,
    Describer,
    ParentMethods,
} from './models/describe.model';
import { Store } from './models/store.model';
import { GetDescriberIdWithPrefix, getDescriberIdWithPrefix } from './utils';

export class Describe implements DescribeCore {
    private getDescriberIdWithPrefix: GetDescriberIdWithPrefix = getDescriberIdWithPrefix;

    constructor(private store: Store) {}

    public fdescribe = (description: string, callback: Callback): void => {
        this.describeHandler({
            description,
            callback,
            parentMethods: this.getEmptyParentMethods(),
            isFDescribe: true,
        });
    };

    public xdescribe = (description: string): void => {
        const { store } = this;
        store.inactiveDescribers = [...store.inactiveDescribers, description];
    };

    public describe = (description: string, callback: Callback): void => {
        this.describeHandler({
            description,
            callback,
            parentMethods: this.getEmptyParentMethods(),
        });
    };

    private childDescribe(
        describerArguments: DescriberArguments,
        describerId: string
    ): void {
        this.describeHandler(describerArguments, describerId);
    }

    private describeHandler(
        describerArguments: DescriberArguments,
        describerId?: string
    ): void {
        const { description, callback, isFDescribe } = describerArguments;

        const {
            isDescriberFormingInProgress,
            nextDescriberArguments,
        } = this.store;

        if (isDescriberFormingInProgress) {
            this.store.nextDescriberArguments = [
                ...nextDescriberArguments,
                {
                    description,
                    callback,
                    parentMethods: this.getEmptyParentMethods(),
                    isFDescribe,
                },
            ];

            return;
        }

        this.beforeCallbackCall(describerArguments, describerId);
        callback();
        this.afterCallbackCall();
    }

    private beforeCallbackCall(
        describerArguments: DescriberArguments,
        describerId: string
    ): void {
        const { store } = this;
        store.activeDescriberId = this.initDescribe(
            describerArguments,
            describerId
        );
        store.isDescriberFormingInProgress = true;
    }

    private afterCallbackCall(): void {
        const { store } = this;
        const { activeDescriberId } = store;

        store.activeDescriberId = null;
        store.isDescriberFormingInProgress = false;

        this.performChildrenDescribers(activeDescriberId);
    }

    private initDescribe(
        { description, parentMethods, isFDescribe }: DescriberArguments,
        describerId?: string
    ): string {
        const id =
            describerId ||
            uniqueid(this.getDescriberIdWithPrefix(isFDescribe, 'root-'));

        const describer: Describer = {
            description,
            beforeEachList: [...parentMethods.beforeEachList],
            afterEachList: [...parentMethods.afterEachList],
            testCases: [],
            childrenDescribersId: [],
            context: {},
            isFDescribe,
        };

        const isRootDescriber = !describerId;
        this.setFormedDescriber(describer, id, isRootDescriber);

        return id;
    }

    private performChildrenDescribers(describerId: string): void {
        const nextDescriberArguments = [...this.store.nextDescriberArguments];
        this.store.nextDescriberArguments = [];

        const parentMethods = this.getParentMethods(describerId);

        nextDescriberArguments.forEach(
            ({ description, callback, isFDescribe }: DescriberArguments) => {
                const childDescriberId = uniqueid(
                    this.getDescriberIdWithPrefix(isFDescribe, 'child-')
                );

                this.addChildDesriberId(describerId, childDescriberId);
                this.childDescribe(
                    {
                        description,
                        callback,
                        parentMethods,
                    },
                    childDescriberId
                );
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
        const describer = this.getDescriberById(describerId);

        describer.childrenDescribersId = [
            ...describer.childrenDescribersId,
            childDescriberId,
        ];
    }

    private getParentMethods(describerId: string): ParentMethods {
        const { afterEachList, beforeEachList } = this.getDescriberById(
            describerId
        );

        return {
            afterEachList: [...afterEachList],
            beforeEachList: [...beforeEachList],
        };
    }

    private getEmptyParentMethods(): ParentMethods {
        return {
            afterEachList: [],
            beforeEachList: [],
        };
    }

    private getDescriberById(describerId: string): Describer {
        return this.store.describers[describerId];
    }
}
