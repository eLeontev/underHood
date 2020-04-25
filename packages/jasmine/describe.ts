import uniqueid from 'lodash.uniqueid';

import { Callback, DescribeModel, DescribeCore } from './jasmine.model';
import {
    Describers,
    NextDescriberArguments,
    Describer,
} from './describe.model';

export class Describe implements DescribeCore {
    private isDescriberFormingCompleted = true;
    private describers: Describers = {};
    private rooDescribersId: Array<string> = [];

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
        if (!this.isDescriberFormingCompleted) {
            this.nextDescriberArguments = [
                ...this.nextDescriberArguments,
                { description, callback },
            ];
            return;
        }

        const describer = this.initDescribe(description);

        this.isDescriberFormingCompleted = false;
        callback();

        this.isDescriberFormingCompleted = true;
        this.performChildrenDescribers(describer, describerId);
    }

    private initDescribe(description: string): Describer {
        return {
            description,
            beforeEachList: [],
            itList: [],
            childrenDescribersId: [],
            context: {},
        };
    }

    private performChildrenDescribers(
        describer: Describer,
        describerId: string
    ): void {
        const nextDescriberArguments = [...this.nextDescriberArguments];
        this.nextDescriberArguments = [];

        nextDescriberArguments.forEach(
            ({ description, callback }: NextDescriberArguments) => {
                const childrenDescriberId = uniqueid('child-');

                this.addChildrenDesriberId(describer, childrenDescriberId);
                this.childDescribe(description, callback, childrenDescriberId);
            }
        );

        this.setFormedDescriber(describer, describerId);
    }

    private setFormedDescriber(
        describer: Describer,
        describerId: string
    ): void {
        let id = describerId;

        if (!id) {
            id = uniqueid('root-');
            this.rooDescribersId = [...this.rooDescribersId, id];
        }

        this.describers = {
            ...this.describers,
            [id]: describer,
        };
    }

    private addChildrenDesriberId(
        describer: Describer,
        childrenDescriberId: string
    ): void {
        describer.childrenDescribersId = [
            ...describer.childrenDescribersId,
            childrenDescriberId,
        ];
    }
}
