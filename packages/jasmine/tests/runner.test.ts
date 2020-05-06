/* eslint-disable @typescript-eslint/no-explicit-any */

import { Runner } from '../runner';
import { store } from '../store';

describe('Runner', () => {
    let instance: any;

    const context = 'context';
    const description = 'description';
    const describerId = 'describerId';

    beforeEach(() => {
        instance = new Runner({ ...store });
    });

    it('should define store on init', () => {
        expect(instance.store).toEqual(store);
    });

    describe('#run', () => {
        const rootDescribersId = 'rootDescribersId';
        const performDescribersResult = 'performDescribersResult';
        const disabledDescriber = 'disabledDescriber';
        const disabledTestCase = 'disabledTestCase';

        beforeEach(() => {
            instance.performDecribers = jest
                .fn()
                .mockName('performDecribers')
                .mockReturnValue(performDescribersResult);
            instance.store.rootDescribersId = rootDescribersId;

            instance.store.inactiveDescribers = [disabledDescriber];
            instance.store.inactiveTestCases = [disabledTestCase];
        });

        it('should async return list of results for all tests', async () => {
            const { testsResults } = await instance.run();

            expect(testsResults).toBe(performDescribersResult);
            expect(instance.performDecribers).toHaveBeenCalledWith(
                rootDescribersId,
                []
            );
        });

        it('should return result including tests cases and description of disabled describers and test cases', async () => {
            const { disabledMethods } = await instance.run();
            expect(disabledMethods.describers).toEqual([disabledDescriber]);
            expect(disabledMethods.testCases).toEqual([disabledTestCase]);
        });
    });

    describe('#performDecribers', () => {
        const describersId = 'describersId';
        const testResults = 'testResults';
        const result = 'result';
        let describersIds: any;

        beforeEach(() => {
            describersIds = ['describersId'];
            instance.performTestsAndReturnTheirResults = jest
                .fn()
                .mockName('performTestsAndReturnTheirResults')
                .mockReturnValue(result);
        });

        it('should return result of async reduce for each passed describerId', async () => {
            expect(
                await instance.performDecribers(describersIds, testResults)
            ).toBe(result);
            expect(
                instance.performTestsAndReturnTheirResults
            ).toHaveBeenCalledWith(testResults, describersId, 0, describersIds);
        });
    });

    describe('#performTestsAndReturnTheirResults', () => {
        const testCaseResult = 'testCaseResult';
        const testResult = 'testResult';
        const testCase = 'testCase';
        const childrenDescribersId = 'childrenDescribersId';

        let bfeCallback: any;
        let afeCallback: any;
        let testsResults: any;

        beforeEach(() => {
            testsResults = [testResult];

            instance.performTestAndReturnItsResult = jest
                .fn()
                .mockName('performTestAndReturnItsResult')
                .mockReturnValue(testCaseResult);
            instance.setActiveDescriberId = jest
                .fn()
                .mockName('setActiveDescriberId');
            instance.setActiveTestCaseIndex = jest
                .fn()
                .mockName('setActiveTestCaseIndex');
            bfeCallback = jest.fn().mockName('bfeCallback');
            afeCallback = jest.fn().mockName('afeCallback');
            instance.performDecribers = jest
                .fn()
                .mockName('performDecribers')
                .mockReturnValue(testsResults);

            instance.store.describers = {
                [describerId]: {
                    testCases: [testCase],
                    beforeEachList: [bfeCallback],
                    afterEachList: [afeCallback],
                    description,
                    context,
                    childrenDescribersId,
                },
            };
        });

        it('should perform test case between before and after each calls with activated describerId', async () => {
            instance.setActiveDescriberId.mockImplementation(
                (isActivated: any) =>
                    isActivated
                        ? expect(bfeCallback).not.toHaveBeenCalled()
                        : ''
            );
            bfeCallback.mockImplementation(() =>
                expect(
                    instance.performTestAndReturnItsResult
                ).not.toHaveBeenCalled()
            );
            instance.performTestAndReturnItsResult.mockImplementation(() =>
                expect(afeCallback).not.toHaveBeenCalled()
            );

            await instance.performTestsAndReturnTheirResults(
                testsResults,
                describerId
            );

            expect(instance.setActiveDescriberId).toHaveBeenCalledWith(
                describerId
            );
            expect(bfeCallback).toHaveBeenCalled();
            expect(afeCallback).toHaveBeenCalled();
            expect(
                instance.performTestAndReturnItsResult
            ).toHaveBeenCalledWith(context, testCase, 0, [testCase]);
        });

        it('should clean up active describerId and active test case index afte rperforming all test methods', async () => {
            afeCallback.mockImplementation(() => {
                expect(instance.setActiveDescriberId).not.toHaveBeenCalledWith(
                    null
                );
                expect(
                    instance.setActiveTestCaseIndex
                ).not.toHaveBeenCalledWith(null);
            });

            await instance.performTestsAndReturnTheirResults(
                testsResults,
                describerId
            );

            expect(instance.setActiveDescriberId).toHaveBeenCalledWith(null);
            expect(instance.setActiveTestCaseIndex).toHaveBeenCalledWith(null);
        });

        it('should async return results of tests', async () => {
            const resutls = await instance.performTestsAndReturnTheirResults(
                testsResults,
                describerId
            );

            expect(resutls).toBe(testsResults);
            expect(instance.performDecribers).toHaveBeenCalledWith(
                childrenDescribersId,
                [
                    ...testsResults,
                    {
                        description,
                        testCaseResults: [testCaseResult],
                    },
                ]
            );
        });
    });

    describe('#performTestAndReturnItsResult', () => {
        const index: any = 'index';
        const validatorResult: any = 'validatorResult';
        const errorValidatorResult: any = 'errorValidatorResult';
        let testCase: any;
        let callback: any;

        beforeEach(() => {
            callback = jest.fn().mockName('callback');
            testCase = {
                it: {
                    callback,
                    description,
                },
                validators: [],
            };
            instance.setActiveTestCaseIndex = jest
                .fn()
                .mockName('setActiveTestCaseIndex');
            instance.asyncCallbackHanlder = jest
                .fn()
                .mockName('asyncCallbackHanlder');
        });

        it('should set active test case index before call it', async () => {
            instance.setActiveTestCaseIndex.mockImplementation(() =>
                expect(instance.asyncCallbackHanlder).not.toHaveBeenCalled()
            );

            await instance.performTestAndReturnItsResult(
                context,
                testCase,
                index
            );

            expect(instance.setActiveTestCaseIndex).toHaveBeenCalledWith(index);
            expect(instance.asyncCallbackHanlder).toHaveBeenCalledWith(
                callback,
                context
            );
        });

        it('should return result of validators with description of test case once test case is called', async () => {
            instance.asyncCallbackHanlder.mockImplementation((): void => {
                testCase.validators.push({ validatorResult });
            });

            const terstCaseValidatorsResult = await instance.performTestAndReturnItsResult(
                context,
                testCase,
                index
            );

            expect(terstCaseValidatorsResult).toEqual({
                itDescription: description,
                validatorResults: [validatorResult],
            });
        });

        it('should return error result if async callback performs more than available timeframe', async () => {
            instance.asyncCallbackHanlder.mockReturnValue(
                Promise.resolve(errorValidatorResult)
            );

            const terstCaseValidatorsResult = await instance.performTestAndReturnItsResult(
                context,
                testCase,
                index
            );

            expect(terstCaseValidatorsResult).toEqual({
                itDescription: description,
                validatorResults: [errorValidatorResult],
            });
        });
    });

    describe('#asyncCallbackHanlder', () => {
        let callback: any;

        beforeEach(() => {
            callback = jest.fn().mockName('callback');
        });

        it('should return void promise if callback is sync', async () => {
            expect(
                await instance.asyncCallbackHanlder(callback, context)
            ).toBeNull();
            expect(callback).toHaveBeenCalled();
        });

        it('should return void promise even if callback retunns any values', async () => {
            callback.mockReturnValue(true);
            expect(
                await instance.asyncCallbackHanlder(callback, context)
            ).toBeNull();
            expect(callback).toHaveBeenCalled();
        });

        it('should return void promise if callback is async but does not exceed time frame limit', async () => {
            callback.mockReturnValue(
                new Promise((res: any) => setTimeout(() => res(true), 50))
            );
            expect(
                await instance.asyncCallbackHanlder(callback, context)
            ).toBeNull();
            expect(callback).toHaveBeenCalled();
        });

        it('should return time frame exceed error promise if callback takes more than available time frame', async () => {
            callback.mockReturnValue(
                new Promise((res: any) => setTimeout(() => res(true), 150))
            );
            expect(
                await instance.asyncCallbackHanlder(callback, context)
            ).toEqual({
                isSuccess: false,
                errorMessage: 'async test takes more than available 100ms',
            });
            expect(callback).toHaveBeenCalled();
        });
    });

    describe('#setActiveDescriberId', () => {
        it('should set passed describerId as active to define valid strcuture of tests results', () => {
            instance.setActiveDescriberId(describerId);
            expect(instance.store.activeDescriberId).toBe(describerId);
        });
    });

    describe('#setActiveTestCaseIndex', () => {
        it('should set passed index as active test case index to set validators result based on its value', () => {
            const index = 123;
            instance.setActiveTestCaseIndex(index);
            expect(instance.store.activeTestCaseIndex).toBe(index);
        });
    });
});
