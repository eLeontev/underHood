import {
    errorMessages,
    expectDoNothing,
    toBeFalsy,
    toBeTruthy,
    getErrorMessage,
} from '../error.messages';

describe('errorMessages', () => {
    it('should contain error messages for all matchers', () => {
        expect(errorMessages.expectDoNothing).toBe(expectDoNothing);
        expect(errorMessages.toBeFalsy).toBe(toBeFalsy);
        expect(errorMessages.toBeTruthy).toBe(toBeTruthy);
    });
});

const expectedValue = 'expectedValue';

describe('#expectDoNothing', () => {
    it('should return valid message based on passed value', () => {
        expect(expectDoNothing(expectedValue)).toBe(
            `looks like this expect does nothing with: ${JSON.stringify(
                expectedValue
            )}`
        );
    });
});

describe('#toBeFalsy', () => {
    it('should return valid message based on passed value', () => {
        expect(toBeFalsy(expectedValue)).toBe(
            `expected ${JSON.stringify(expectedValue)} to be falsy`
        );
    });
});

describe('#toBeTruthy', () => {
    it('should return valid message based on passed value', () => {
        expect(toBeTruthy(expectedValue)).toBe(
            `expected ${JSON.stringify(expectedValue)} to be truthy`
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
                actualResult,
                expectedResult
            )
        ).toBe('');
    });

    it('should not call error message callback in susses case', () => {
        getErrorMessage(
            true,
            errorMessageCallback,
            actualResult,
            expectedResult
        );
        expect(errorMessageCallback).not.toHaveBeenCalled();
    });

    it('should return call errorMessage callback with actual and expected result and form valid error message with them', () => {
        expect(
            getErrorMessage(
                false,
                errorMessageCallback,
                actualResult,
                expectedResult
            )
        ).toBe(errorMessage);
        expect(errorMessageCallback).toHaveBeenCalledWith(
            actualResult,
            expectedResult
        );
    });
});
