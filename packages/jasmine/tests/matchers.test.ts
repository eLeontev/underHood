/* eslint-disable @typescript-eslint/no-explicit-any */

import { Matchers } from '../matchers';

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
        matchers = new Matchers(validator, validators);
    });

    it('should define matchers on init', () => {
        expect(matchers.toBeFalsy).toBeDefined();
        expect(matchers.toBeTruthy).toBeDefined();
    });

    it('should define validator on init', () => {
        expect(matchers.validator).toBe(validator);
    });

    describe('#getValidator', () => {
        const validatorMethodResult = 'validatorMethodResult';
        beforeEach(() => {
            matchers.setValidatorResult = jest
                .fn()
                .mockName('setValidatorResult');
            matchers.getActualResult = jest
                .fn()
                .mockName('getActualResult')
                .mockReturnValue(actualResult);
            validators.toBeTruthy.mockReturnValue(validatorMethodResult);
        });

        it('should return callback which will call passed validator method and set its result to validator', () => {
            const validator = matchers.getValidator(validators.toBeTruthy);
            expect(matchers.setValidatorResult).not.toHaveBeenCalled();

            const expectedResults = [1, 2, 3, 4, 5];
            validator(...expectedResults);

            expect(matchers.getActualResult).toHaveBeenCalled();
            expect(validators.toBeTruthy).toHaveBeenCalledWith(
                actualResult,
                ...expectedResults
            );
            expect(matchers.setValidatorResult).toHaveBeenCalledWith(
                validatorMethodResult
            );
        });
    });

    describe('#getActualResult', () => {
        it('should return actual result storied in valdiator', () => {
            expect(matchers.getActualResult()).toBe(actualResult);
        });
    });

    describe('#setValidatorResult', () => {
        const validatorResult = 'validatorResult';
        it('should set validator result to validator', () => {
            matchers.setValidatorResult(validatorResult);
            expect(validator.validatorResult).toBe(validatorResult);
        });
    });
});
