import { ItModel, BeforeAfterEachModel } from './jasmine.model';
import { Describer } from './describe.model';

export interface InnerMethods {
    it: ItModel;
    beforeEach: BeforeAfterEachModel;
    afterEach: BeforeAfterEachModel;
    getActiveDescriber(): Describer;
}
