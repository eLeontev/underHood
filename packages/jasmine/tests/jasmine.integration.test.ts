/* eslint-disable @typescript-eslint/no-explicit-any */

import { getTestInstanceWithMockData } from '../mock/integration.mock';

describe('Integration tests: Describe', () => {
    let instance: any;
    let bfeCallbackFirst: any;
    let bfeCallbackSecond: any;
    let bfeCallbackThird: any;
    let afeCallbackFirst: any;
    let afeCallbackSecond: any;
    let afeCallbackThird: any;
    let itCallbackFirst: any;
    let itCallbackSecond: any;
    let itCallbackThird: any;
    let itCallbackFourth: any;
    let itCallbackFifth: any;
    let itCallbackSixth: any;

    beforeAll(() => {
        const instanceWithMockData = getTestInstanceWithMockData();

        instance = instanceWithMockData.instance;
        bfeCallbackFirst = instanceWithMockData.bfeCallbackFirst;
        bfeCallbackSecond = instanceWithMockData.bfeCallbackSecond;
        bfeCallbackThird = instanceWithMockData.bfeCallbackThird;
        afeCallbackFirst = instanceWithMockData.afeCallbackFirst;
        afeCallbackSecond = instanceWithMockData.afeCallbackSecond;
        afeCallbackThird = instanceWithMockData.afeCallbackThird;
        itCallbackFirst = instanceWithMockData.itCallbackFirst;
        itCallbackSecond = instanceWithMockData.itCallbackSecond;
        itCallbackThird = instanceWithMockData.itCallbackThird;
        itCallbackFourth = instanceWithMockData.itCallbackFourth;
        itCallbackFifth = instanceWithMockData.itCallbackFifth;
        itCallbackSixth = instanceWithMockData.itCallbackSixth;
    });

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
                beforeEachList: [bfeCallbackFirst, bfeCallbackSecond],
                afterEachList: [afeCallbackFirst],
                testCases: [],
                childrenDescribersId: ['child-3'],
                context: {},
            });
        });

        it('"child-3": should form valid relationship structure of describers', () => {
            expect(instance.store.describers['child-3']).toEqual({
                description: 'child-3',
                beforeEachList: [
                    bfeCallbackFirst,
                    bfeCallbackSecond,
                    bfeCallbackThird,
                ],
                afterEachList: [afeCallbackFirst, afeCallbackSecond],
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
                beforeEachList: [bfeCallbackFirst, bfeCallbackSecond],
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
    let instance: any;

    beforeEach(() => {
        instance = getTestInstanceWithMockData().instance;
    });

    it('should return promise with reuslts of #run', () => {
        const resultsPromise = instance.run();
        expect(resultsPromise.then((res: any) => res)).toBeDefined();
        expect(resultsPromise.catch((res: any) => res)).toBeDefined();
    });

    it('should return valid results even for async it cases', async () => {
        const { testsResults } = await instance.run();
        const [root1, child2, child3, child4, root5, child6] = testsResults;
        expect(root1).toEqual({
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
                        {
                            errorMessage: '',
                            isSuccess: true,
                        },
                        {
                            errorMessage: 'expected "returnValue" to be falsy',
                            isSuccess: false,
                        },
                    ],
                },
                {
                    itDescription: 'it-2',
                    validatorResults: [
                        {
                            errorMessage:
                                'async test takes more than available 100ms',
                            isSuccess: false,
                        },
                    ],
                },
            ],
        });

        expect(child2).toEqual({
            description: 'child-2',
            testCaseResults: [],
        });

        expect(child3).toEqual({
            description: 'child-3',
            testCaseResults: [
                {
                    itDescription: 'it-3',
                    validatorResults: [
                        {
                            errorMessage: 'expected "it works" to be falsy',
                            isSuccess: false,
                        },
                        {
                            errorMessage: 'expected 30 to be falsy',
                            isSuccess: false,
                        },
                    ],
                },
            ],
        });

        expect(child4).toEqual({
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
        });

        expect(root5).toEqual({
            description: 'root-5',
            testCaseResults: [
                {
                    itDescription: 'it-5',
                    validatorResults: [
                        {
                            isSuccess: true,
                            errorMessage: '',
                        },
                        {
                            errorMessage:
                                'expected "invalid" not to be "invalid"',
                            isSuccess: false,
                        },
                        {
                            errorMessage: 'expected "valid" to be "invalid"',
                            isSuccess: false,
                        },
                    ],
                },
            ],
        });

        expect(child6).toEqual({
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
                            errorMessage:
                                'expected {"a":[123]} not to equal {"a":[123]}',
                            isSuccess: false,
                        },
                        {
                            errorMessage:
                                'expected function with name: fn1 to equal function with name: fn2',
                            isSuccess: false,
                        },
                    ],
                },
            ],
        });
    });
});
