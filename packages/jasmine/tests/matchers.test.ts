/* eslint-disable @typescript-eslint/no-explicit-any */

import { Matchers, MatchersTypes } from '../matchers';
import { expectDoNothing, getErrorMessage, expectSpy } from '../error.messages';

describe('Matchers', () => {
    let matchers: any;

    let validator: any;
    let validators: any;

    const actualResult = 'actualResult';

    beforeEach(() => {
        validator = {
            actualResult,
        };
        validators = {
            toBeTruthy: jest.fn().mockName('toBeTruthy'),
            toBeFalsy: jest.fn().mockName('toBeFalsy'),
        };
    });

    beforeEach(() => {
        matchers = new Matchers(validator, validators, false);
    });

    it('should set error message methdod on init', () => {
        expect(matchers.getErrorMessage).toBe(getErrorMessage);
    });

    it('should define matchers on init', () => {
        expect(matchers.toBeFalsy).toBeDefined();
        expect(matchers.toBeTruthy).toBeDefined();
    });

    it('should define validator on init', () => {
        expect(matchers.validator).toBe(validator);
        expect(matchers.isNot).toBeFalsy();
    });

    it('should define validator on init with negative validators', () => {
        expect(matchers.not.validator).toBe(validator);
        expect(matchers.not.isNot).toBeTruthy();
        expect(matchers.not.toBeFalsy).toBeDefined();
        expect(matchers.not.toBeTruthy).toBeDefined();
        expect(matchers.not.getErrorMessage).toBe(getErrorMessage);
    });

    describe('#getValidator', () => {
        let validatorMethod: any;
        let expectedResults: any;

        const validatorResult = 'validatorResult';

        beforeEach(() => {
            expectedResults = [1, 2, 3, 4];
            matchers.getValidatorResult = jest
                .fn()
                .mockName('getValidatorResult')
                .mockReturnValue(validatorResult);
            matchers.setValidatorResult = jest
                .fn()
                .mockName('setValidatorResult')
                .mockReturnValue(validatorResult);
        });

        it('should return validator call of which should call orignial validator method', () => {
            const matcher = matchers.getValidator(
                validatorMethod,
                MatchersTypes.expectDoNothing
            );

            expect(matchers.getValidatorResult).not.toHaveBeenCalled();

            matcher(...expectedResults);

            expect(matchers.getValidatorResult).toHaveBeenCalledWith(
                validatorMethod,
                MatchersTypes.expectDoNothing,
                expectedResults
            );
        });

        it('should set validator result to active test case based on validator results', () => {
            matchers.getValidator(
                validatorMethod,
                MatchersTypes.expectDoNothing
            )(...expectedResults);

            expect(matchers.setValidatorResult).toHaveBeenCalledWith(
                validatorResult
            );
        });
    });

    describe('#getValidatorResult', () => {
        const errorMessageCallback = 'errorMessageCallback';
        const isSuccess = 'isSuccess';
        const errorMessage = 'errorMessage';
        const validatorMethod = 'validatorMethod';
        const matcherType = 'matcherType';
        const isNot = 'isNot';

        let resultWIthErrorCallback: any;
        let expectedResults: any;

        beforeEach(() => {
            resultWIthErrorCallback = {
                isSuccess,
                errorMessageCallback,
            };
            expectedResults = [1, 2, 3, 4];

            matchers.isNot = isNot;
            matchers.getActualResult = jest
                .fn()
                .mockName('getActualResult')
                .mockReturnValue(actualResult);
            matchers.isExpectedSpyNotPassed = jest
                .fn()
                .mockName('isExpectedSpyNotPassed');
            matchers.getExpectedSpyNotPassedValidatorResult = jest
                .fn()
                .mockName('getExpectedSpyNotPassedValidatorResult');
            matchers.getValidatorResultWithErrorCallback = jest
                .fn()
                .mockName('getValidatorResultWithErrorCallback');
            matchers.getErrorMessage = jest
                .fn()
                .mockName('getErrorMessage')
                .mockReturnValue(errorMessage);
        });

        it('should return default failed result if spy validator received not the spy', () => {
            matchers.isExpectedSpyNotPassed.mockReturnValue(true);
            matchers.getExpectedSpyNotPassedValidatorResult.mockReturnValue(
                resultWIthErrorCallback
            );

            expect(
                matchers.getValidatorResult(
                    validatorMethod,
                    matcherType,
                    expectedResults
                )
            ).toEqual({
                isSuccess,
                errorMessage,
            });
            expect(matchers.getActualResult).toHaveBeenCalled();
            expect(matchers.isExpectedSpyNotPassed).toHaveBeenCalledWith(
                actualResult,
                matcherType
            );
            expect(
                matchers.getExpectedSpyNotPassedValidatorResult
            ).toHaveBeenCalled();
            expect(
                matchers.getValidatorResultWithErrorCallback
            ).not.toHaveBeenCalled();
            expect(matchers.getErrorMessage).toHaveBeenCalledWith(
                isSuccess,
                errorMessageCallback,
                isNot,
                actualResult,
                ...expectedResults
            );
        });

        it('should return  actual validator result in other cases', () => {
            matchers.isExpectedSpyNotPassed.mockReturnValue(false);
            matchers.getValidatorResultWithErrorCallback.mockReturnValue(
                resultWIthErrorCallback
            );

            expect(
                matchers.getValidatorResult(
                    validatorMethod,
                    matcherType,
                    expectedResults
                )
            ).toEqual({
                isSuccess,
                errorMessage,
            });
            expect(matchers.getActualResult).toHaveBeenCalled();
            expect(matchers.isExpectedSpyNotPassed).toHaveBeenCalledWith(
                actualResult,
                matcherType
            );
            expect(
                matchers.getExpectedSpyNotPassedValidatorResult
            ).not.toHaveBeenCalled();
            expect(
                matchers.getValidatorResultWithErrorCallback
            ).toHaveBeenCalledWith(
                validatorMethod,
                actualResult,
                matcherType,
                expectedResults
            );
            expect(matchers.getErrorMessage).toHaveBeenCalledWith(
                isSuccess,
                errorMessageCallback,
                isNot,
                actualResult,
                ...expectedResults
            );
        });
    });

    describe('#getValidatorResultWithErrorCallback', () => {
        const validatorMethodResult = 'validatorMethodResult';
        let validatorMethod: any;
        let expectedResults: any;

        beforeEach(() => {
            expectedResults = [1, 2, 3, 4];
            validatorMethod = jest
                .fn()
                .mockName('validatorMethod')
                .mockReturnValue(validatorMethodResult);
        });

        it('should return result of validator with errorCallback if inversion is not active', () => {
            expect(
                matchers.getValidatorResultWithErrorCallback(
                    validatorMethod,
                    actualResult,
                    MatchersTypes.expectDoNothing,
                    expectedResults
                )
            ).toEqual({
                isSuccess: validatorMethodResult,
                errorMessageCallback: expectDoNothing,
            });
            expect(validatorMethod).toHaveBeenCalledWith(
                actualResult,
                ...expectedResults
            );
        });

        it('should return opposit result of validator with errorCallback if inversion is active', () => {
            matchers.isNot = true;
            expect(
                matchers.getValidatorResultWithErrorCallback(
                    validatorMethod,
                    actualResult,
                    MatchersTypes.expectDoNothing,
                    expectedResults
                )
            ).toEqual({
                isSuccess: false,
                errorMessageCallback: expectDoNothing,
            });
            expect(validatorMethod).toHaveBeenCalledWith(
                actualResult,
                ...expectedResults
            );
        });
    });

    describe('#isExpectedSpyNotPassed', () => {
        beforeEach(() => {
            matchers.isSpy = jest.fn().mockName('isSpy');
        });

        it('should return true if spy is not passed to spy validator', () => {
            matchers.isSpy.mockReturnValue(false);
            expect(
                matchers.isExpectedSpyNotPassed(
                    actualResult,
                    MatchersTypes.toHaveBeenCalled
                )
            ).toBeTruthy();
            expect(
                matchers.isExpectedSpyNotPassed(
                    actualResult,
                    MatchersTypes.toHaveBeenCalledWith
                )
            ).toBeTruthy();
        });

        it('should return false in other cases', () => {
            matchers.isSpy.mockReturnValue(false);
            expect(
                matchers.isExpectedSpyNotPassed(
                    actualResult,
                    MatchersTypes.expectDoNothing
                )
            ).toBeFalsy();
            matchers.isSpy.mockReturnValue(true);
            expect(
                matchers.isExpectedSpyNotPassed(
                    actualResult,
                    MatchersTypes.toHaveBeenCalledWith
                )
            ).toBeFalsy();
        });
    });

    describe('#getExpectedSpyNotPassedValidatorResult', () => {
        it('should return default result for spy validator if spy is not passed', () => {
            expect(matchers.getExpectedSpyNotPassedValidatorResult()).toEqual({
                isSuccess: false,
                errorMessageCallback: expectSpy,
            });
        });
    });

    describe('#getActualResult', () => {
        it('should return actual result storied in valdiator', () => {
            expect(matchers.getActualResult()).toBe(actualResult);
        });

        it('should return actual result with possiblitiy to return result of spy', () => {
            const actualResultWithSpyValidation =
                'actualResultWithSpyValidation';
            matchers.getActualResultWithSpy = jest
                .fn()
                .mockName('getActualResultWithSpy')
                .mockReturnValue(actualResultWithSpyValidation);

            expect(matchers.getActualResult()).toBe(
                actualResultWithSpyValidation
            );
            expect(matchers.getActualResultWithSpy).toHaveBeenCalledWith(
                actualResult
            );
        });
    });

    describe('#setValidatorResult', () => {
        const validatorResult = 'validatorResult';
        it('should set validator result to validator', () => {
            matchers.setValidatorResult(validatorResult);
            expect(validator.validatorResult).toBe(validatorResult);
        });
    });

    describe('#setNotField', () => {
        let setNotField: any;
        let context: any;

        beforeEach(() => {
            setNotField = matchers.setNotField;
            context = {};
        });

        it('should do nothing if isNot already defined', () => {
            setNotField.call(context, validator, validators, true);
            expect(context).toEqual({});
        });

        it('should set not field on instance with new matchers instane ', () => {
            setNotField.call(context, validator, validators, false);
            expect(context.not.isNot).toBeTruthy();
        });
    });
});
