import { Matchers, MatchersTypes } from './matchers';
import { errorMessages } from './error.messages';
import { Validators } from './validators';

import { TestCase } from './models/describe.model';
import { Validator, MatchersCore, ActualResult } from './models/matchers.model';
import { Store } from './models/store.model';

export class Expect {
    constructor(private store: Store) {}

    public expect = (actualResult: ActualResult): MatchersCore => {
        const {
            describers,
            activeDescriberId,
            activeTestCaseIndex,
        } = this.store;
        const testCase =
            describers[activeDescriberId].testCases[activeTestCaseIndex];

        return this.getMastchers(testCase, actualResult);
    };

    private getMastchers(
        testCase: TestCase,
        actualResult: ActualResult
    ): MatchersCore {
        const validator = this.getRegisteredValidator(testCase, actualResult);

        return new Matchers(validator, new Validators());
    }

    private getRegisteredValidator(
        testCase: TestCase,
        actualResult: ActualResult
    ): Validator {
        const validator: Validator = {
            actualResult,
            validatorResult: {
                isSuccess: false,
                errorMessage: errorMessages[MatchersTypes.expectDoNothing](
                    false,
                    actualResult
                ),
            },
        };

        testCase.validators = [...testCase.validators, validator];

        return validator;
    }
}
