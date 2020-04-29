import { Matchers, MatchersTypes } from './matcher';
import { errorMessages } from './error.messages';

import { TestCase } from './models/describe.model';
import {
    Validator,
    MatchersCore,
    ExpectedResult,
} from './models/matcher.model';
import { Store } from './models/store.model';

export class Expect {
    constructor(private store: Store) {}

    public expect = (expectedResult: ExpectedResult): MatchersCore => {
        const {
            describers,
            activeDescriberId,
            activeTestCaseIndex,
        } = this.store;
        const testCase =
            describers[activeDescriberId].testCases[activeTestCaseIndex];

        return this.getMastchers(testCase, expectedResult);
    };

    private getMastchers(
        testCase: TestCase,
        expectedResult: ExpectedResult
    ): MatchersCore {
        const validator = this.getRegisteredValidator(testCase, expectedResult);

        return new Matchers(validator);
    }

    private getRegisteredValidator(
        testCase: TestCase,
        expectedResult: ExpectedResult
    ): Validator {
        const validator: Validator = {
            expectedResult,
            validatorResult: {
                isSuccess: false,
                errorMessage: errorMessages[MatchersTypes.expectDoNothing](
                    expectedResult
                ),
            },
        };

        testCase.validators = [...testCase.validators, validator];

        return validator;
    }
}
