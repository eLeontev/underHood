import { Matchers, MatchersTypes } from './matcher';

import { Describers, TestCase } from './describe.model';
import { Validator, MatchersCore, ExpectedResult } from './matcher.model';
import { errorMessages } from './error.messages';
import { InnerMethods } from './expect.model';

export class Expect {
    private activeDescriberId: string;
    private activeTestCaseIndex: number;
    private describers: Describers;

    public expect(expectedResult: ExpectedResult): MatchersCore {
        const testCase = this.describers[this.activeDescriberId].testCases[
            this.activeTestCaseIndex
        ];

        return this.getValidators(testCase, expectedResult);
    }

    private getValidators(
        testCase: TestCase,
        expectedResult: ExpectedResult
    ): MatchersCore {
        const matcher = this.getRegisteredValidator(testCase, expectedResult);

        return new Matchers(matcher);
    }

    private getRegisteredValidator(
        testCase: TestCase,
        expectedResult: ExpectedResult
    ): Validator {
        const validator: Validator = {
            expectedResult,
            validatorCallback: () => ({
                isSuccess: false,
                errorMessage: errorMessages[MatchersTypes.expectDoNothing](
                    expectedResult
                ),
            }),
        };

        testCase.validators = [...testCase.validators, validator];

        return validator;
    }

    public getMethods(): InnerMethods {
        return {
            expect: this.expect,
            getRegisteredValidator: this.getRegisteredValidator,
            getValidators: this.getValidators,
        };
    }
}
