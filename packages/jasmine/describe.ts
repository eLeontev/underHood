import uniqueid from 'lodash.uniqueid';

import { Callback, DescribeModel, DescribeCore } from './jasmine.model';
import {
    Describers,
    NextDescriberArguments,
    Describer,
} from './describe.model';

export class Describe implements DescribeCore {
    private activeDescriberId: string;
    private isDescriberFormingInProgress = false;
    private describers: Describers = {};
    private rootDescribersId: Array<string> = [];

    private nextDescriberArguments: Array<NextDescriberArguments> = [];

    public describe: DescribeModel = (
        description: string,
        callback: Callback
    ): void => {
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
        if (this.isDescriberFormingInProgress) {
            this.nextDescriberArguments = [
                ...this.nextDescriberArguments,
                { description, callback },
            ];

            return;
        }

        this.beforeCallbackCall(description, describerId);
        callback.call(this);
        this.afterCallbackCall();
    }

    private beforeCallbackCall(description: string, describerId: string): void {
        this.activeDescriberId = this.initDescribe(description, describerId);
        this.isDescriberFormingInProgress = true;
    }

    private afterCallbackCall(): void {
        const { activeDescriberId } = this;

        this.activeDescriberId = null;
        this.isDescriberFormingInProgress = false;

        this.performChildrenDescribers(activeDescriberId);
    }

    private initDescribe(description: string, describerId?: string): string {
        const id = describerId || uniqueid('root-');
        const describer = {
            description,
            beforeEachList: [],
            itList: [],
            childrenDescribersId: [],
            context: {},
        };

        const isRootDescriber = !describerId;
        this.setFormedDescriber(describer, id, isRootDescriber);

        return id;
    }

    private performChildrenDescribers(describerId: string): void {
        const nextDescriberArguments = [...this.nextDescriberArguments];
        this.nextDescriberArguments = [];

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
        if (isRootDescriber) {
            this.rootDescribersId = [...this.rootDescribersId, describerId];
        }

        this.describers = {
            ...this.describers,
            [describerId]: describer,
        };
    }

    private addChildDesriberId(
        describerId: string,
        childDescriberId: string
    ): void {
        const describer = this.describers[describerId];

        describer.childrenDescribersId = [
            ...describer.childrenDescribersId,
            childDescriberId,
        ];
    }
}
