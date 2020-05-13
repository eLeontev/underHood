/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Jasmine } from '../jasmine';

const inst = new Jasmine();

const fit1 = () => inst.expect(1).toBe(1);
const fit2 = () => inst.expect(1).toBe(1);
const it1 = () => inst.expect(1).toBe(1);
const it2 = () => inst.expect(1).toBe(1);
inst.describe('d1', () => {
    inst.fit('fit1', fit1);
});

inst.fdescribe('fd1', () => {
    inst.fit('fit2', fit2);

    inst.it('it1', it1);

    inst.describe('d2', () => {
        inst.it('it2', it2);
    });

    inst.xdescribe('x2', () => {
        inst.fit('fit3', () => {
            inst.expect(1).toBe(1);
        });
    });
});

const getTestResults = async (
    resultsPromise: any,
    index: number
): Promise<any> => {
    const { testsResults } = await resultsPromise;
    return testsResults[index];
};

describe('validate f/x/ access modificators to describe method', () => {
    describe('validate formed structue with modificators methods', () => {
        it('should return list of valid describersId', () => {
            expect((inst as any).store.fDescribersId).toEqual([
                'descr-2',
                'fdescr-4',
                'fdescr-5',
            ]);

            expect(Object.keys((inst as any).store.describers)).toEqual([
                'root-1',
                'descr-2',
                'froot-3',
                'fdescr-4',
                'fdescr-5',
                'child-6',
            ]);
        });

        it('child-6: -> should return valid sctructure of the tests with modificators', () => {
            expect((inst as any).store.describers['child-6']).toEqual({
                afterEachList: [],
                beforeEachList: [],
                childrenDescribersId: [],
                context: {},
                description: 'd2',
                isFDescribe: undefined,
                testCases: [
                    {
                        it: { callback: it2, description: 'it2' },
                        validators: [],
                    },
                ],
            });
        });

        it('descr-2: -> should return valid sctructure of the tests with modificators', () => {
            expect((inst as any).store.describers['descr-2']).toEqual({
                afterEachList: [],
                beforeEachList: [],
                childrenDescribersId: [],
                context: {},
                description: 'd1',
                isFDescribe: undefined,
                testCases: [
                    {
                        it: { callback: fit1, description: 'fit1' },
                        validators: [],
                    },
                ],
            });
        });

        it('fdescr-4: -> should return valid sctructure of the tests with modificators', () => {
            expect((inst as any).store.describers['fdescr-4']).toEqual({
                afterEachList: [],
                beforeEachList: [],
                childrenDescribersId: [],
                context: {},
                description: 'fd1',
                isFDescribe: true,
                testCases: [
                    {
                        it: { callback: fit2, description: 'fit2' },
                        validators: [],
                    },
                ],
            });
        });

        it('fdescr-5: -> should return valid sctructure of the tests with modificators', () => {
            expect((inst as any).store.describers['fdescr-5']).toEqual({
                afterEachList: [],
                beforeEachList: [],
                childrenDescribersId: [],
                context: {},
                description: 'fd1',
                isFDescribe: true,
                testCases: [
                    {
                        it: { callback: it1, description: 'it1' },
                        validators: [],
                    },
                ],
            });
        });

        it('froot-3: -> should return valid sctructure of the tests with modificators', () => {
            expect((inst as any).store.describers['froot-3']).toEqual({
                afterEachList: [],
                beforeEachList: [],
                childrenDescribersId: ['child-6'],
                context: {},
                description: 'fd1',
                isFDescribe: true,
                testCases: [],
            });
        });

        it('root-1: -> should return valid sctructure of the tests with modificators', () => {
            expect((inst as any).store.describers['root-1']).toEqual({
                afterEachList: [],
                beforeEachList: [],
                childrenDescribersId: [],
                context: {},
                description: 'd1',
                isFDescribe: undefined,
                testCases: [],
            });
        });
    });

    describe('validate tests results with modificators methods', () => {
        it('should return valid list of disabled methods', async () => {
            const { disabledMethods } = await inst.run();
            expect(disabledMethods.describers).toEqual(['x2']);
            expect(disabledMethods.testCases).toEqual([]);
        });

        it('should perform only tests placed in f if they exists', async () => {
            const { testsResults } = await inst.run();
            expect(testsResults.length).toBe(3);
        });

        it('d1: -> should return valid list of passed tests', async () => {
            const results = await getTestResults(inst.run(), 0);
            expect(results).toEqual({
                description: 'd1',
                testCaseResults: [
                    {
                        itDescription: 'fit1',
                        validatorResults: [
                            { errorMessage: '', isSuccess: true },
                        ],
                    },
                ],
            });
        });

        it('f1 fit2: -> should return valid list of passed tests', async () => {
            const results = await getTestResults(inst.run(), 1);
            expect(results).toEqual({
                description: 'fd1',
                testCaseResults: [
                    {
                        itDescription: 'fit2',
                        validatorResults: [
                            { errorMessage: '', isSuccess: true },
                        ],
                    },
                ],
            });
        });

        it('f1 it1: -> should return valid list of passed tests', async () => {
            const results = await getTestResults(inst.run(), 2);
            expect(results).toEqual({
                description: 'fd1',
                testCaseResults: [
                    {
                        itDescription: 'it1',
                        validatorResults: [
                            { errorMessage: '', isSuccess: true },
                        ],
                    },
                ],
            });
        });
    });
});
