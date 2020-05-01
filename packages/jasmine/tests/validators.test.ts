/* eslint-disable @typescript-eslint/no-explicit-any */

import { Validators } from '../validators';
import { getErrorMessage, errorMessages } from '../error.messages';

describe('Validators', () => {
    let validators: any;

    beforeEach(() => {
        validators = new Validators();
    });

    it('should set error message methdo on init', () => {
        expect(validators.getErrorMessage).toBe(getErrorMessage);
    });

    describe('validators:', () => {
        let getErrorMessageSpy: any;
        const errorMessage = 'errorMessage';

        beforeEach(() => {
            getErrorMessageSpy = jest
                .fn()
                .mockName('getErrorMessageSpy')
                .mockReturnValue(errorMessage);
            validators.getErrorMessage = getErrorMessageSpy;
        });

        describe('#toBeFalsy', () => {
            it('should return error message', () => {
                expect(validators.toBeFalsy().errorMessage).toBe(errorMessage);
                expect(getErrorMessageSpy).toHaveBeenCalledWith(
                    true,
                    errorMessages.toBeFalsy,
                    undefined
                );
            });

            it('should reurn succes result if actual result is falsy', () => {
                expect(validators.toBeFalsy().isSuccess).toBeTruthy();
                expect(validators.toBeFalsy('').isSuccess).toBeTruthy();
                expect(validators.toBeFalsy(null).isSuccess).toBeTruthy();
                expect(validators.toBeFalsy(0).isSuccess).toBeTruthy();
                expect(validators.toBeFalsy(false).isSuccess).toBeTruthy();
            });

            it('should reurn failure result if actual result is truthy', () => {
                expect(validators.toBeFalsy(true).isSuccess).toBeFalsy();
            });
        });

        describe('#toBeTruthy', () => {
            it('should return error message', () => {
                expect(validators.toBeTruthy().errorMessage).toBe(errorMessage);
                expect(getErrorMessageSpy).toHaveBeenCalledWith(
                    false,
                    errorMessages.toBeTruthy,
                    undefined
                );
            });

            it('should reurn succes result if actual result is falsy', () => {
                expect(validators.toBeTruthy(true).isSuccess).toBeTruthy();
                expect(validators.toBeTruthy(' ').isSuccess).toBeTruthy();
                expect(validators.toBeTruthy([]).isSuccess).toBeTruthy();
                expect(validators.toBeTruthy({}).isSuccess).toBeTruthy();
                expect(validators.toBeTruthy(Function).isSuccess).toBeTruthy();
            });

            it('should reurn failure result if actual result is truthy', () => {
                expect(validators.toBeTruthy(false).isSuccess).toBeFalsy();
            });
        });
    });
});
