import { BeforeAfterEachCore, Callback } from './jasmine.model';
import { Describers, Describer } from './describe.model';

export class BeforeAfterEach implements BeforeAfterEachCore {
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

    private getActiveDescriber(): Describer {
        const { activeDescriberId, describers } = this;
        return describers[activeDescriberId];
    }

    public getMethods(): any {
        return {
            beforeEach: this.beforeEach,
            afterEach: this.afterEach,
            getActiveDescriber: this.getActiveDescriber,
        };
    }
}
