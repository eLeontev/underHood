/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    getNotMessage,
    errorMessages,
    expectDoNothing,
    toBeFalsy,
    toBeTruthy,
    getErrorMessage,
    testTimeFrameDurationExeeded,
    toBe,
    toEqual,
    toHaveBeenCalled,
    toHaveBeenCalledWith,
    expectSpy,
} from '../error.messages';
import { stringifyPassedValue } from '../utils';

describe('#getNotMessage', () => {
    it('should return string with space if isNot is not set', () => {
        expect(getNotMessage(false)).toBe(' ');
    });

    it('should return string with not if isNot is set', () => {
        expect(getNotMessage(true)).toBe(' not ');
    });
});

describe('errorMessages', () => {
    it('should contain error messages for all matchers', () => {
        expect(errorMessages.testTimeFrameDurationExeeded).toBe(
            testTimeFrameDurationExeeded
        );
        expect(errorMessages.expectDoNothing).toBe(expectDoNothing);
        expect(errorMessages.toBeFalsy).toBe(toBeFalsy);
        expect(errorMessages.toBeTruthy).toBe(toBeTruthy);
        expect(errorMessages.toBe).toBe(toBe);
        expect(errorMessages.toEqual).toBe(toEqual);
        expect(errorMessages.toHaveBeenCalled).toBe(toHaveBeenCalled);
        expect(errorMessages.toHaveBeenCalledWith).toBe(toHaveBeenCalledWith);
        expect(errorMessages.expectSpy).toBe(expectSpy);
    });
});

const actualResult = 'actualResult';
const expectedResult = 'expectedResult';

describe('#testTimeFrameDurationExeeded', () => {
    it('should return valid message based on passed value', () => {
        expect(testTimeFrameDurationExeeded(false, actualResult, [])).toBe(
            `async test takes more than available ${stringifyPassedValue(
                actualResult
            )}ms`
        );
    });
});

describe('#expectDoNothing', () => {
    it('should return valid message based on passed value', () => {
        expect(expectDoNothing(false, actualResult, [])).toBe(
            `looks like this expect does nothing with: ${stringifyPassedValue(
                actualResult
            )}`
        );
    });
});

describe('#toBeFalsy', () => {
    it('should return valid message based on passed value', () => {
        expect(toBeFalsy(false, actualResult, [])).toBe(
            `expected ${stringifyPassedValue(actualResult)} to be falsy`
        );

        expect(toBeFalsy(true, actualResult, [])).toBe(
            `expected ${stringifyPassedValue(actualResult)} not to be falsy`
        );
    });
});

describe('#toBeTruthy', () => {
    it('should return valid message based on passed value', () => {
        expect(toBeTruthy(false, actualResult, [])).toBe(
            `expected ${stringifyPassedValue(actualResult)} to be truthy`
        );
        expect(toBeTruthy(true, actualResult, [])).toBe(
            `expected ${stringifyPassedValue(actualResult)} not to be truthy`
        );
    });
});

describe('#toBe', () => {
    it('should return valid message based on passed value', () => {
        expect(toBe(false, actualResult, [expectedResult])).toBe(
            `expected ${stringifyPassedValue(
                actualResult
            )} to be ${stringifyPassedValue(expectedResult)}`
        );
        expect(toBe(true, actualResult, [expectedResult])).toBe(
            `expected ${stringifyPassedValue(
                actualResult
            )} not to be ${stringifyPassedValue(expectedResult)}`
        );
    });
});

describe('#toEqual', () => {
    it('should return valid message based on passed value', () => {
        expect(toEqual(false, actualResult, [expectedResult])).toBe(
            `expected ${stringifyPassedValue(
                actualResult
            )} to equal ${stringifyPassedValue(expectedResult)}`
        );
        expect(toEqual(true, actualResult, [expectedResult])).toBe(
            `expected ${stringifyPassedValue(
                actualResult
            )} not to equal ${stringifyPassedValue(expectedResult)}`
        );
    });
});

const spyName = 'spyName';
const getSpyProperties = (): any => ({ spyName });

describe('#toHaveBeenCalled', () => {
    it('should return valid message based on passed value', () => {
        expect(toHaveBeenCalled(false, { getSpyProperties }, [])).toBe(
            `expected spy ${spyName} to have been called`
        );
        expect(toHaveBeenCalled(true, { getSpyProperties }, [])).toBe(
            `expected spy ${spyName} not to have been called`
        );
    });
});

describe('#toHaveBeenCalledWith', () => {
    it('should return valid message based on passed value', () => {
        expect(
            toHaveBeenCalledWith(false, { getSpyProperties }, [expectedResult])
        ).toBe(
            `expected spy ${spyName} to have been called with ${stringifyPassedValue(
                [expectedResult]
            )}`
        );
        expect(
            toHaveBeenCalledWith(true, { getSpyProperties }, [expectedResult])
        ).toBe(
            `expected spy ${spyName} not to have been called with ${stringifyPassedValue(
                [expectedResult]
            )}`
        );
    });
});

describe('#expectSpy', () => {
    it('should return valid message based on passed value', () => {
        expect(expectSpy(false, actualResult, [])).toBe(
            `expected spy but got ${stringifyPassedValue(actualResult)}`
        );
        expect(expectSpy(true, actualResult, [])).toBe(
            `expected spy but got ${stringifyPassedValue(actualResult)}`
        );
    });
});

describe('#getErrorMessage', () => {
    let errorMessageCallback: any;
    const errorMessage = 'errorMessage';
    const actualResult = 'actualResult';
    const expectedResult = 'expectedResult';

    beforeEach(() => {
        errorMessageCallback = jest
            .fn()
            .mockName('errorMessageCallback')
            .mockReturnValue(errorMessage);
    });

    it('should return empty string if result if validator is successfull', () => {
        expect(
            getErrorMessage(
                true,
                errorMessageCallback,
                true,
                actualResult,
                expectedResult
            )
        ).toBe('');
    });

    it('should not call error message callback in susses case', () => {
        getErrorMessage(
            true,
            errorMessageCallback,
            true,
            actualResult,
            expectedResult
        );
        expect(errorMessageCallback).not.toHaveBeenCalled();
    });

    it('should return call of errorMessage callback with actual and expected result and form valid error message with them', () => {
        expect(
            getErrorMessage(
                false,
                errorMessageCallback,
                true,
                actualResult,
                expectedResult
            )
        ).toBe(errorMessage);
        expect(errorMessageCallback).toHaveBeenCalledWith(true, actualResult, [
            expectedResult,
        ]);
    });
});
