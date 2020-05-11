/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any */

import { InnerDescribeMethods } from '../inner-describe.methods';
import { store } from '../store';

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
        instance = new InnerDescribeMethods({ ...store });
    });

    beforeEach(() => {
        callback = jest.fn().mockName('callback');
        describer = {
            beforeEachList: [existedBeforeEachCallback],
            afterEachList: [existedAfterEachCallback],
            testCases: [existedItStructure],
        };
    });

    describe('#fit', () => {
        const fDescriber = 'fDescriber';

        beforeEach(() => {
            instance.getActiveDescriber = jest
                .fn()
                .mockName('getActiveDescriber')
                .mockReturnValue(describer);
            instance.getFDescriber = jest
                .fn()
                .mockName('getFDescriber')
                .mockReturnValue(fDescriber);
            instance.registerFDescriber = jest
                .fn()
                .mockName('registerFDescriber');
        });

        it('should form fDescriber from active describer and register it in the collection of describers', () => {
            instance.fit(description, callback);

            expect(instance.getActiveDescriber).toHaveBeenCalled();
            expect(instance.getFDescriber).toHaveBeenCalledWith(describer, {
                description,
                callback,
            });
            expect(instance.registerFDescriber).toHaveBeenCalledWith(
                fDescriber
            );
        });
    });

    describe('#xit', () => {
        it('should store disabled test case description in state', () => {
            const disabledTestCaseDescription = 'disabledTestCaseDescription';
            instance.store.inactiveTestCases = [disabledTestCaseDescription];

            instance.xit(description, callback);

            expect(instance.store.inactiveTestCases).toEqual([
                disabledTestCaseDescription,
                description,
            ]);
        });
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
            instance.store.activeDescriberId = activeDescriberId;
            instance.store.describers[activeDescriberId] = describer;
        });

        it('should return active describer', () => {
            expect(instance.getActiveDescriber()).toBe(describer);
        });
    });

    describe('#getFDescriber', () => {
        it('should return fDescriber contains bfe/afe lists of passed describers', () => {
            const it: any = 'it';

            expect(instance.getFDescriber(describer, it)).toEqual({
                beforeEachList: [existedBeforeEachCallback],
                afterEachList: [existedAfterEachCallback],
                childrenDescribersId: [],
                context: {},
                testCases: [
                    {
                        it,
                        validators: [],
                    },
                ],
            });
        });
    });

    describe('#registerFDescriber', () => {
        const existedFDescriberId: any = 'existedFDescriberId';

        beforeEach(() => {
            instance.store.describers = { existedDescribers: true };
            instance.store.fDescribersId = [existedFDescriberId];
        });

        it('should set passed fDescriber to existed describers and set its Id in the fDescriberId list', () => {
            instance.registerFDescriber(describer);
            expect(instance.store.describers).toEqual({
                existedDescribers: true,
                'fdescr-1': describer,
            });
            expect(instance.store.fDescribersId).toEqual([
                existedFDescriberId,
                'fdescr-1',
            ]);
        });
    });
});
