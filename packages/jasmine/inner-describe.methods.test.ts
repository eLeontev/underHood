/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any */

import { InnerDescribeMethods } from './inner-describe.methods';

describe('InnerDescribeMethods', () => {
    let instance: any;
    let callback: any;
    let describer: any;

    const description = 'description';
    const activeDescriberId = 'activeDescriberId';
    const existedBeforeEachCallback = 'existedBeforeEachCallback';
    const existedAfterEachCallback = 'existedAfterEachCallback';
    const existedItStructure = 'existedItStructure';

    beforeEach(() => {
        instance = new InnerDescribeMethods();
    });

    beforeEach(() => {
        callback = jest.fn().mockName('callback');
        describer = {
            beforeEachList: [existedBeforeEachCallback],
            afterEachList: [existedAfterEachCallback],
            testCases: [existedItStructure],
        };
    });

    describe('#beforeEach', () => {
        beforeEach(() => {
            instance.getActiveDescriber = jest
                .fn()
                .mockName('getActiveDescriber')
                .mockReturnValue(describer);
        });

        it('should add passed beforeEach callback to list of existed to active describer', () => {
            instance.beforeEach(callback);
            expect(instance.getActiveDescriber).toHaveBeenCalled();
            expect(describer.beforeEachList).toEqual([
                existedBeforeEachCallback,
                callback,
            ]);
        });
    });

    describe('#afterEach', () => {
        beforeEach(() => {
            instance.getActiveDescriber = jest
                .fn()
                .mockName('getActiveDescriber')
                .mockReturnValue(describer);
        });

        it('should add passed afterEach callback to list of existed to active describer', () => {
            instance.afterEach(callback);
            expect(instance.getActiveDescriber).toHaveBeenCalled();
            expect(describer.afterEachList).toEqual([
                existedAfterEachCallback,
                callback,
            ]);
        });
    });

    describe('#it', () => {
        beforeEach(() => {
            instance.getActiveDescriber = jest
                .fn()
                .mockName('getActiveDescriber')
                .mockReturnValue(describer);
        });

        it('should init new test cases with passed description and callback and empty validators to active describer', () => {
            instance.it(description, callback);
            expect(instance.getActiveDescriber).toHaveBeenCalled();
            expect(describer.testCases).toEqual([
                existedItStructure,
                { it: { description, callback }, validators: [] },
            ]);
        });
    });

    describe('#getActiveDescriber', () => {
        beforeEach(() => {
            instance.activeDescriberId = activeDescriberId;
            instance.describers[activeDescriberId] = describer;
        });

        it('should return active describer', () => {
            expect(instance.getActiveDescriber()).toBe(describer);
        });
    });

    describe('#getMethods', () => {
        it('should  return innder-describe methods to assigne them to main entry', () => {
            expect(instance.getMethods()).toEqual({
                it: instance.it,
                beforeEach: instance.beforeEach,
                afterEach: instance.afterEach,
                getActiveDescriber: instance.getActiveDescriber,
            });
        });
    });
});
