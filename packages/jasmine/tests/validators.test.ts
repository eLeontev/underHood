/* eslint-disable @typescript-eslint/no-explicit-any */

import { Validators } from '../validators';

describe('Validators', () => {
    let validators: any;

    const arr: any = [];
    const obj: any = {};
    const fn1: any = () => ({});
    const fn2: any = () => ({});

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

        describe('#toBe', () => {
            it('should reurn succes result if actual value strong equaly to the expected result', () => {
                expect(validators.toBe(true, true)).toBeTruthy();
                expect(validators.toBe(' ', ' ')).toBeTruthy();
                expect(validators.toBe(arr, arr)).toBeTruthy();
                expect(validators.toBe(obj, obj)).toBeTruthy();
                expect(validators.toBe(fn1, fn1)).toBeTruthy();
            });

            it('should reurn failure in other cases', () => {
                expect(validators.toBe(true, 123)).toBeFalsy();
                expect(validators.toBe('', false)).toBeFalsy();
                expect(validators.toBe(arr, [])).toBeFalsy();
                expect(validators.toBe(obj, {})).toBeFalsy();
                expect(validators.toBe(fn1, fn2)).toBeFalsy();
            });
        });

        describe('#toEqual', () => {
            it('should reurn succes result if actual value for equaly to the expected result', () => {
                expect(validators.toEqual(true, true)).toBeTruthy();
                expect(validators.toEqual(' ', ' ')).toBeTruthy();
                expect(validators.toEqual(arr, [])).toBeTruthy();
                expect(validators.toEqual(obj, {})).toBeTruthy();
                expect(validators.toEqual(fn1, fn1)).toBeTruthy();
            });

            it('should reurn failure in other cases', () => {
                expect(validators.toEqual(true, 123)).toBeFalsy();
                expect(validators.toEqual('', false)).toBeFalsy();
                expect(validators.toEqual(arr, [123])).toBeFalsy();
                expect(validators.toEqual(obj, { a: 321 })).toBeFalsy();
                expect(validators.toEqual(fn1, fn2)).toBeFalsy();
            });
        });

        describe('spy validators', () => {
            let spy: any;

            beforeEach(() => {
                spy = {
                    getSpyProperties: jest.fn().mockName('getSpyProperties'),
                };
            });

            describe('#toHaveBeenCalled', () => {
                it('should reurn succes result if passed spy was called', () => {
                    spy.getSpyProperties.mockReturnValue({ isCalled: true });
                    expect(validators.toHaveBeenCalled(spy, [])).toBeTruthy();
                });

                it('should reurn failure if passed spy was not called', () => {
                    spy.getSpyProperties.mockReturnValue({ isCalled: false });
                    expect(validators.toHaveBeenCalled(spy, [])).toBeFalsy();
                });
            });

            describe('#toHaveBeenCalledWith', () => {
                it('should reurn succes result if passed spy was called with expected arguments', () => {
                    spy.getSpyProperties.mockReturnValue({
                        args: [[], [true, arr, fn1], [fn2]],
                    });
                    expect(
                        validators.toHaveBeenCalledWith(spy, true, arr, fn1)
                    ).toBeTruthy();
                });

                it('should reurn failure if passed spy was not called', () => {
                    spy.getSpyProperties.mockReturnValue({
                        args: [[fn1], [arr], [obj]],
                    });
                    expect(
                        validators.toHaveBeenCalledWith(spy, true)
                    ).toBeFalsy();
                });
            });
        });
    });
});
