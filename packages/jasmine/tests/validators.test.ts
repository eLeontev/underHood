/* eslint-disable @typescript-eslint/no-explicit-any */

import { Validators } from '../validators';

describe('Validators', () => {
    let validators: any;

    beforeEach(() => {
        validators = new Validators();
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
            it('should reurn succes result if actual result is falsy', () => {
                expect(validators.toBeFalsy()).toBeTruthy();
                expect(validators.toBeFalsy('')).toBeTruthy();
                expect(validators.toBeFalsy(null)).toBeTruthy();
                expect(validators.toBeFalsy(0)).toBeTruthy();
                expect(validators.toBeFalsy(false)).toBeTruthy();
            });

            it('should reurn failure result if actual result is truthy', () => {
                expect(validators.toBeFalsy(true)).toBeFalsy();
            });
        });

        describe('#toBeTruthy', () => {
            it('should reurn succes result if actual result is falsy', () => {
                expect(validators.toBeTruthy(true)).toBeTruthy();
                expect(validators.toBeTruthy(' ')).toBeTruthy();
                expect(validators.toBeTruthy([])).toBeTruthy();
                expect(validators.toBeTruthy({})).toBeTruthy();
                expect(validators.toBeTruthy(Function)).toBeTruthy();
            });

            it('should reurn failure result if actual result is truthy', () => {
                expect(validators.toBeTruthy(false)).toBeFalsy();
            });
        });
    });
});
