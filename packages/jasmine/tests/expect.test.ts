/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any */

import { Expect } from '../expect';
import { store } from '../store';
import { Matchers } from '../matchers';
import { stringifyPassedValue } from '../utils';

describe('Expect', () => {
    let instance: any;

    let testCase: any;
    const actualResult: any = 'actualResult';

    beforeEach(() => {
        testCase = 'testCase';
    });

    beforeEach(() => {
        instance = new Expect({ ...store });
    });

    describe('#expect', () => {
        const activeDescriberId: any = 'activeDescriberId';
        const activeTestCaseIndex: any = 'activeTestCaseIndex';
        const matchers: any = 'matchers';

        beforeEach(() => {
            instance.getMastchers = jest
                .fn()
                .mockName('getMastchers')
                .mockReturnValue(matchers);
            instance.store = {
                activeDescriberId,
                activeTestCaseIndex,
                describers: {
                    [activeDescriberId]: {
                        testCases: {
                            [activeTestCaseIndex]: testCase,
                        },
                    },
                },
            };
        });

        it('should return matchers for expected value', () => {
            expect(instance.expect(actualResult)).toBe(matchers);
        });

        it('should pass to getMatchers method expected result and active test case', () => {
            instance.expect(actualResult);
            expect(instance.getMastchers).toHaveBeenCalledWith(
                testCase,
                actualResult
            );
        });
    });

    describe('#getMastchers', () => {
        const validator: any = 'validator';

        beforeEach(() => {
            instance.getRegisteredValidator = jest
                .fn()
                .mockName('getRegisteredValidator')
                .mockReturnValue(validator);
        });

        it('should register validator based on passed test case and expected result', () => {
            instance.getMastchers(testCase, actualResult);
            expect(instance.getRegisteredValidator).toHaveBeenCalledWith(
                testCase,
                actualResult
            );
        });

        it('should create new instance of matchers with ave validator in their', () => {
            const matchers = instance.getMastchers(testCase, actualResult);
            expect(matchers.validator).toBe(validator);
            expect(matchers.__proto__.constructor).toBe(Matchers);
        });
    });

    describe('#getRegisteredValidator', () => {
        let newCreadtedValidator: any;
        const existedValidators: any = 'existedValidators';

        beforeEach(() => {
            testCase = {
                validators: [existedValidators],
            };
            newCreadtedValidator = {
                actualResult,
                validatorResult: {
                    isSuccess: false,
                    errorMessage: `looks like this expect does nothing with: ${stringifyPassedValue(
                        actualResult
                    )}`,
                },
            };
        });

        it('should mutate passed test case to add new validator to existed validators', () => {
            instance.getRegisteredValidator(testCase, actualResult);

            const [existed, validator] = testCase.validators;

            expect(existed).toBe(existedValidators);
            expect(validator).toEqual(newCreadtedValidator);
        });

        it('should return new created validator', () => {
            expect(
                instance.getRegisteredValidator(testCase, actualResult)
            ).toEqual(newCreadtedValidator);
        });
    });
});
