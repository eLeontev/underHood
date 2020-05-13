/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Jasmine } from '../jasmine';

const instance = new Jasmine();

let a: any;

const cb1 = (): any => {};
const cb2 = (): any => {};
const cb3 = (): any => {};
const cb4 = (): any => {
    a = 10;
};
const cb5 = (): any => {
    instance.expect(a).toBe(10);
};
const cb6 = (): any => {};
const cb7 = (): any => {
    a = a * 2;
};
const cb8 = (): any => {
    instance.expect(a).toBe(20);
};
const cb9 = (): any => {};
const cb10 = (): any => {};

instance.xdescribe('disabled describer', () => {
    instance.it('is not registered', cb1);
});

instance.describe('1 enabled describer', () => {
    instance.xit('disasbled test case', cb2);
    instance.it('1 enabled test case', cb3);
});

instance.describe('2 enabled describer', () => {
    instance.beforeEach(cb4);
    instance.fit('1 chosen test case', cb5);
    instance.it('2 enabled test case', cb6);

    instance.describe('enabled nested describer with chosen test case', () => {
        instance.beforeEach(cb7);
        instance.fit('2 chosen test case', cb8);
    });

    instance.describe(
        'enabled nested describer without chosen test case',
        () => {
            instance.it('3 enabled test case', cb9);
        }
    );

    instance.fit('3 chosen test case', cb10);
});

const getDescriberById = (instance: any, describerId: string): any =>
    instance.store.describers[describerId];

describe('test of enabled/disabled/chosen test cases', () => {
    it('root-1: shold return valid structure', () => {
        expect(getDescriberById(instance, 'root-1')).toEqual({
            afterEachList: [],
            beforeEachList: [],
            childrenDescribersId: [],
            context: {},
            description: '1 enabled describer',
            testCases: [
                {
                    it: {
                        callback: cb3,
                        description: '1 enabled test case',
                    },
                    validators: [],
                },
            ],
        });
    });

    it('root-2: shold return valid structure', () => {
        expect(getDescriberById(instance, 'root-2')).toEqual({
            afterEachList: [],
            beforeEachList: [cb4],
            childrenDescribersId: ['child-5', 'child-7'],
            context: {},
            description: '2 enabled describer',
            testCases: [
                {
                    it: {
                        callback: cb6,
                        description: '2 enabled test case',
                    },
                    validators: [],
                },
            ],
        });
    });

    it('child-5: shold return valid structure', () => {
        expect(getDescriberById(instance, 'child-5')).toEqual({
            afterEachList: [],
            beforeEachList: [cb4, cb7],
            childrenDescribersId: [],
            context: {},
            description: 'enabled nested describer with chosen test case',
            testCases: [],
        });
    });

    it('child-7: shold return valid structure', () => {
        expect(getDescriberById(instance, 'child-7')).toEqual({
            afterEachList: [],
            beforeEachList: [cb4],
            childrenDescribersId: [],
            context: {},
            description: 'enabled nested describer without chosen test case',
            testCases: [
                {
                    it: {
                        callback: cb9,
                        description: '3 enabled test case',
                    },
                    validators: [],
                },
            ],
        });
    });

    it('descr-3: shold return valid structure', () => {
        expect(getDescriberById(instance, 'descr-3')).toEqual({
            afterEachList: [],
            beforeEachList: [cb4],
            childrenDescribersId: [],
            context: {},
            description: '2 enabled describer',
            testCases: [
                {
                    it: {
                        callback: cb5,
                        description: '1 chosen test case',
                    },
                    validators: [],
                },
            ],
        });
    });

    it('descr-4: shold return valid structure', () => {
        expect(getDescriberById(instance, 'descr-4')).toEqual({
            afterEachList: [],
            beforeEachList: [cb4],
            childrenDescribersId: [],
            context: {},
            description: '2 enabled describer',
            testCases: [
                {
                    it: {
                        callback: cb10,
                        description: '3 chosen test case',
                    },
                    validators: [],
                },
            ],
        });
    });

    it('descr-6: shold return valid structure', () => {
        expect(getDescriberById(instance, 'descr-6')).toEqual({
            afterEachList: [],
            beforeEachList: [cb4, cb7],
            childrenDescribersId: [],
            context: {},
            description: 'enabled nested describer with chosen test case',
            testCases: [
                {
                    it: {
                        callback: cb8,
                        description: '2 chosen test case',
                    },
                    validators: [],
                },
            ],
        });
    });
});

describe('test for forming root describer/fdescriber Ids', () => {
    it('should form valid list of rootDescribersId', () => {
        expect((instance as any).store.rootDescribersId).toEqual([
            'root-1',
            'root-2',
        ]);
    });

    it('should form valid list of rootFDescribersId', () => {
        expect((instance as any).store.fDescribersId).toEqual([
            'descr-3',
            'descr-4',
            'descr-6',
        ]);
    });
});

const getAsyncResultsByIndex = async (
    results: any,
    index: number
): Promise<any> => {
    const { testsResults } = await results;
    return testsResults[index];
};

describe('test for validation of test results with enabled/disabled/chosen test cases', () => {
    it('should return valid list of disabled describers and test cases', async () => {
        const { disabledMethods } = await instance.run();
        expect(disabledMethods.describers).toEqual(['disabled describer']);
        expect(disabledMethods.testCases).toEqual(['disasbled test case']);
    });

    it('should return only results of chosen test cases if they exists', async () => {
        const { testsResults } = await instance.run();
        expect(testsResults.length).toBe(3);
    });

    it('should return valid results of chosen test cases', async () => {
        const { testsResults } = await instance.run();
        expect(testsResults.length).toBe(3);
    });

    describe('validate results of chosen test cases', () => {
        it('1 chosen test case: should return valid result', async () => {
            expect(await getAsyncResultsByIndex(instance.run(), 0)).toEqual({
                description: '2 enabled describer',
                testCaseResults: [
                    {
                        itDescription: '1 chosen test case',
                        validatorResults: [
                            { errorMessage: '', isSuccess: true },
                        ],
                    },
                ],
            });
        });

        it('3 chosen test case: should return valid result', async () => {
            expect(await getAsyncResultsByIndex(instance.run(), 1)).toEqual({
                description: '2 enabled describer',
                testCaseResults: [
                    {
                        itDescription: '3 chosen test case',
                        validatorResults: [],
                    },
                ],
            });
        });

        it('2 chosen test case: should return valid result', async () => {
            expect(await getAsyncResultsByIndex(instance.run(), 2)).toEqual({
                description: 'enabled nested describer with chosen test case',
                testCaseResults: [
                    {
                        itDescription: '2 chosen test case',
                        validatorResults: [
                            { errorMessage: '', isSuccess: true },
                        ],
                    },
                ],
            });
        });
    });
});
