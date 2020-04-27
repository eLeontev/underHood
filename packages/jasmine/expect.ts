import { Matchers, MatchersTypes } from './matcher';

import { Describers, Describer } from './describe.model';
import { Validator, MatchersCore, ExpectedResult } from './matcher.model';
import { errorMessages } from './error.messages';

export class Expect {
    private activeDesriberId: string;
    private describers: Describers;

    public expect(expectedResult: ExpectedResult): MatchersCore {
        const describer = this.describers[this.activeDesriberId];

        return this.getValidators(describer, expectedResult);
    }

    public getValidators(
        describer: Describer,
        expectedResult: ExpectedResult
    ): MatchersCore {
        const matcher = this.getRegisteredValidator(describer, expectedResult);

        return new Matchers(matcher);
    }

    private getRegisteredValidator(
        describer: Describer,
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

        describer.validators = [...describer.validators, validator];

        return validator;
    }
}
