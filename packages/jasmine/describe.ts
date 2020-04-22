import uniqueid from 'lodash.uniqueid';

import { Callback, DescribeModel, DescribeCore } from './jasmine.model';
import { Describers, NextDescriberArguments } from './describe.model';

export class Describe implements DescribeCore {
    private uniqueid: () => string;
    private entryDescriberId: string;
    private describerId: string;
    private describers: Describers = {};

    private nextDescriberArguments: NextDescriberArguments;

    constructor() {
        this.uniqueid = uniqueid;
        this.entryDescriberId = uniqueid();
        this.describerId = this.entryDescriberId;
    }

    public describe: DescribeModel = (
        description: string,
        callback: Callback
    ): void => {
        if (this.hasProcessedDesribe()) {
            this.nextDescriberArguments = { description, callback };
            return;
        }

        this.initDescribe(description);

        callback();

        this.completeDesribeForming();
        this.performNextDescribe();
    };

    private initDescribe(description: string): void {
        const { describerId } = this;

        this.describers = {
            ...this.describers,
            [describerId]: {
                description,
                beforeEachList: [],
                itList: [],
                childrenDescriberId: null,
                context: {},
            },
        };
    }

    private hasProcessedDesribe(): boolean {
        const { describers, describerId, entryDescriberId } = this;

        const isNotRootDescribe = describerId !== entryDescriberId;
        const isParentDescribeNotFormed = !describers[describerId]
            .childrenDescriberId;

        return !isNotRootDescribe && isParentDescribeNotFormed;
    }

    private completeDesribeForming(): void {
        const { describers, describerId } = this;
        this.generateChildrenEntryDescriptionId();

        describers[describerId].childrenDescriberId = this.describerId;
    }

    private performNextDescribe(): void {
        if (!this.nextDescriberArguments) {
            return;
        }

        const { description, callback } = this.nextDescriberArguments;
        this.nextDescriberArguments = null;

        this.describe(description, callback);
    }

    private generateChildrenEntryDescriptionId(): void {
        this.describerId = uniqueid();
    }
}
