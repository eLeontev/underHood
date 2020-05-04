/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    getNotMessage,
    errorMessages,
    expectDoNothing,
    toBeFalsy,
    toBeTruthy,
    getErrorMessage,
    testTimeFrameDurationExeeded,
} from '../error.messages';

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
    });
});

const actualResult = 'actualResult';

describe('#testTimeFrameDurationExeeded', () => {
    it('should return valid message based on passed value', () => {
        expect(testTimeFrameDurationExeeded(false, actualResult)).toBe(
            `async test takes more than available ${JSON.stringify(
                actualResult
            )}ms`
        );
    });
});

describe('#expectDoNothing', () => {
    it('should return valid message based on passed value', () => {
        expect(expectDoNothing(false, actualResult)).toBe(
            `looks like this expect does nothing with: ${JSON.stringify(
                actualResult
            )}`
        );
    });
});

describe('#toBeFalsy', () => {
    it('should return valid message based on passed value', () => {
        expect(toBeFalsy(false, actualResult)).toBe(
            `expected ${JSON.stringify(actualResult)} to be falsy`
        );

        expect(toBeFalsy(true, actualResult)).toBe(
            `expected ${JSON.stringify(actualResult)} not to be falsy`
        );
    });
});

describe('#toBeTruthy', () => {
    it('should return valid message based on passed value', () => {
        expect(toBeTruthy(false, actualResult)).toBe(
            `expected ${JSON.stringify(actualResult)} to be truthy`
        );
        expect(toBeTruthy(true, actualResult)).toBe(
            `expected ${JSON.stringify(actualResult)} not to be truthy`
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
        expect(errorMessageCallback).toHaveBeenCalledWith(
            true,
            actualResult,
            expectedResult
        );
    });
});
