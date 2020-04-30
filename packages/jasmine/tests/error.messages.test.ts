import {
    errorMessages,
    expectDoNothing,
    toBeFalsy,
    toBeTruthy,
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
