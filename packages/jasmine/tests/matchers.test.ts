/* eslint-disable @typescript-eslint/no-explicit-any */

import { Matchers, MatchersTypes } from '../matchers';
import { expectDoNothing, getErrorMessage } from '../error.messages';

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

        const errorMessage = 'errorMessage';
        const isSuccess = 'isSuccess';

        beforeEach(() => {
            expectedResults = [1, 2, 3, 4];
            validatorMethod = jest
                .fn()
                .mockName('validatorMethod')
                .mockReturnValue(isSuccess);
            matchers.getActualResult = jest
                .fn()
                .mockName('getActualResult')
                .mockReturnValue(actualResult);
            matchers.setValidatorResult = jest
                .fn()
                .mockName('setValidatorResult');
            matchers.getErrorMessage = jest
                .fn()
                .mockName('getErrorMessage')
                .mockReturnValue(errorMessage);
        });

        it('should return validator call of which should call orignial validator method', () => {
            const matcher = matchers.getValidator(
                validatorMethod,
                MatchersTypes.expectDoNothing
            );

            expect(validatorMethod).not.toHaveBeenCalled();

            matcher(...expectedResults);

            expect(matchers.getActualResult).toHaveBeenCalled();
            expect(validatorMethod).toHaveBeenCalledWith(
                actualResult,
                ...expectedResults
            );
        });

        it('should set validator result to active test case based on validator results', () => {
            matchers.getValidator(
                validatorMethod,
                MatchersTypes.expectDoNothing
            )(...expectedResults);

            expect(matchers.getErrorMessage).toHaveBeenCalledWith(
                isSuccess,
                expectDoNothing,
                false,
                actualResult,
                ...expectedResults
            );
            expect(matchers.setValidatorResult).toHaveBeenCalledWith({
                isSuccess,
                errorMessage,
            });
        });

        it('should set validator result with negative results if valdiator called from "NOT"', () => {
            matchers.isNot = true;
            matchers.getValidator(
                validatorMethod,
                MatchersTypes.expectDoNothing
            )(...expectedResults);

            expect(matchers.getErrorMessage).toHaveBeenCalledWith(
                false,
                expectDoNothing,
                true,
                actualResult,
                ...expectedResults
            );
            expect(matchers.setValidatorResult).toHaveBeenCalledWith({
                isSuccess: false,
                errorMessage,
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
