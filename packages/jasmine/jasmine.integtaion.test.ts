/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */

import { Jasmine } from './jasmine';

const instance: any = new Jasmine();

const bfeCallbackFirst = () => {};
const bfeCallbackSecond = () => {};
const bfeCallbackThird = () => {};

const afeCallbackFirst = () => {};
const afeCallbackSecond = () => {};
const afeCallbackThird = () => {};

const itCallbackFirst = () => {
    instance.expect('without matcher');
};
const itCallbackSecond = () => {
    instance.expect('valid').toBeTruthly();
};
const itCallbackThird = () => {
    instance.expect('invalid').toBeFalsy();
};
const itCallbackFourth = () => {
    instance.expect(false).toBeFalsy();
    instance.expect(undefined).toBeFalsy();
    instance.expect(null).toBeFalsy();
};
const itCallbackFifth = () => {
    instance.expect('valid').toBeTruthly();
};
const itCallbackSixth = () => {
    instance.expect(0).toBeFalsy();
    instance.expect('').toBeFalsy();
};

instance.describe('root-1', () => {
    instance.beforeEach(bfeCallbackFirst);
    instance.it('it-1', itCallbackFirst);
    instance.describe('child-2', () => {
        instance.afterEach(afeCallbackFirst);

        instance.describe('child-3', () => {
            instance.beforeEach(bfeCallbackThird);
            instance.it('it-3', itCallbackThird);
            instance.afterEach(afeCallbackSecond);
        });
    });

    instance.beforeEach(bfeCallbackSecond);
    instance.describe('child-4', () => {
        instance.it('it-4', itCallbackFourth);
    });

    instance.it('it-2', itCallbackSecond);
});

instance.describe('root-5', () => {
    instance.describe('child-6', () => {
        instance.afterEach(afeCallbackThird);
        instance.it('it-6', itCallbackSixth);
    });

    instance.it('it-5', itCallbackFifth);
});

describe('Integration tests: Describe', () => {
    describe('should form valid relationship structure of describers for:', () => {
        it('"root-1": should form valid relationship structure of describers', () => {
            expect(instance.store.describers['root-1']).toEqual({
                description: 'root-1',
                beforeEachList: [bfeCallbackFirst, bfeCallbackSecond],
                afterEachList: [],
                testCases: [
                    {
                        it: { description: 'it-1', callback: itCallbackFirst },
                        validators: [],
                    },
                    {
                        it: { description: 'it-2', callback: itCallbackSecond },
                        validators: [],
                    },
                ],
                childrenDescribersId: ['child-2', 'child-4'],
                context: {},
            });
        });

        it('"root-5": should form valid relationship structure of describers', () => {
            expect(instance.store.describers['root-5']).toEqual({
                description: 'root-5',
                beforeEachList: [],
                afterEachList: [],
                testCases: [
                    {
                        it: { description: 'it-5', callback: itCallbackFifth },
                        validators: [],
                    },
                ],
                childrenDescribersId: ['child-6'],
                context: {},
            });
        });

        it('"child-2": should form valid relationship structure of describers', () => {
            expect(instance.store.describers['child-2']).toEqual({
                description: 'child-2',
                beforeEachList: [],
                afterEachList: [afeCallbackFirst],
                testCases: [],
                childrenDescribersId: ['child-3'],
                context: {},
            });
        });

        it('"child-3": should form valid relationship structure of describers', () => {
            expect(instance.store.describers['child-3']).toEqual({
                description: 'child-3',
                beforeEachList: [bfeCallbackThird],
                afterEachList: [afeCallbackSecond],
                testCases: [
                    {
                        it: { description: 'it-3', callback: itCallbackThird },
                        validators: [],
                    },
                ],
                childrenDescribersId: [],
                context: {},
            });
        });

        it('"child-4": should form valid relationship structure of describers', () => {
            expect(instance.store.describers['child-4']).toEqual({
                description: 'child-4',
                beforeEachList: [],
                afterEachList: [],
                testCases: [
                    {
                        it: { description: 'it-4', callback: itCallbackFourth },
                        validators: [],
                    },
                ],
                childrenDescribersId: [],
                context: {},
            });
        });

        it('"child-6": should form valid relationship structure of describers', () => {
            expect(instance.store.describers['child-6']).toEqual({
                description: 'child-6',
                beforeEachList: [],
                afterEachList: [afeCallbackThird],
                testCases: [
                    {
                        it: { description: 'it-6', callback: itCallbackSixth },
                        validators: [],
                    },
                ],
                childrenDescribersId: [],
                context: {},
            });
        });
    });

    it('should collect root describers id in separate list', () => {
        expect(instance.store.rootDescribersId).toEqual(['root-1', 'root-5']);
    });

    it('should link children describers in parent', () => {
        expect(
            instance.store.describers['root-1'].childrenDescribersId
        ).toEqual(['child-2', 'child-4']);
        expect(
            instance.store.describers['root-5'].childrenDescribersId
        ).toEqual(['child-6']);
        expect(
            instance.store.describers['child-2'].childrenDescribersId
        ).toEqual(['child-3']);
        expect(
            instance.store.describers['child-3'].childrenDescribersId
        ).toEqual([]);
        expect(
            instance.store.describers['child-4'].childrenDescribersId
        ).toEqual([]);
        expect(
            instance.store.describers['child-6'].childrenDescribersId
        ).toEqual([]);
    });
});

describe('results validation', () => {
    let results: any;

    beforeEach(() => {
        results = instance.run();
    });

    it('should return valid results', () => {
        expect(results).toEqual([
            {
                description: 'root-1',
                testCaseResults: [
                    {
                        itDescription: 'it-1',
                        validatorResults: [
                            {
                                isSuccess: false,
                                errorMessage:
                                    'looks like this expect does nothing with: "without matcher"',
                            },
                        ],
                    },
                    {
                        itDescription: 'it-2',
                        validatorResults: [
                            {
                                isSuccess: true,
                                errorMessage: '',
                            },
                        ],
                    },
                ],
            },
            {
                description: 'child-2',
                testCaseResults: [],
            },
            {
                description: 'child-3',
                testCaseResults: [
                    {
                        itDescription: 'it-3',
                        validatorResults: [
                            {
                                isSuccess: false,
                                errorMessage: 'expected "invalid" to be falsy',
                            },
                        ],
                    },
                ],
            },
            {
                description: 'child-4',
                testCaseResults: [
                    {
                        itDescription: 'it-4',
                        validatorResults: [
                            {
                                isSuccess: true,
                                errorMessage: '',
                            },
                            {
                                isSuccess: true,
                                errorMessage: '',
                            },
                            {
                                isSuccess: true,
                                errorMessage: '',
                            },
                        ],
                    },
                ],
            },
            {
                description: 'root-5',
                testCaseResults: [
                    {
                        itDescription: 'it-5',
                        validatorResults: [
                            {
                                isSuccess: true,
                                errorMessage: '',
                            },
                        ],
                    },
                ],
            },
            {
                description: 'child-6',
                testCaseResults: [
                    {
                        itDescription: 'it-6',
                        validatorResults: [
                            {
                                isSuccess: true,
                                errorMessage: '',
                            },
                            {
                                isSuccess: true,
                                errorMessage: '',
                            },
                        ],
                    },
                ],
            },
        ]);
    });
});
