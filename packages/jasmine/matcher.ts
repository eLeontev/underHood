import { errorMessages } from './error.messages';

import {
    Validator,
    MatchersCore,
    ValidatorResult,
    ExpectedResult,
    ActualResult,
    ValidatorCallback,
} from './models/matcher.model';
import { ErrorMessageCallback } from './models/error.messages.model';

export enum MatchersTypes {
    expectDoNothing = 'expectDoNothing',
    toBeFalsy = 'toBeFalsy',
    toBeTruthy = 'toBeTruthy',
}

export class Matchers implements MatchersCore {
    constructor(private validator: Validator) {}

    public toBeFalsy(): void {
        this.setValidatorCallback(
            (): ValidatorResult => {
                const {
                    validator: { expectedResult },
                } = this;

                const isSuccess = !expectedResult;
                const errorMessage = this.getErrorMessage(
                    isSuccess,
                    errorMessages[MatchersTypes.toBeFalsy],
                    expectedResult
                );

                return {
                    isSuccess,
                    errorMessage,
                };
            }
        );
    }

    public toBeTruthy(): void {
        this.setValidatorCallback(
            (): ValidatorResult => {
                const {
                    validator: { expectedResult },
                } = this;
                const isSuccess = Boolean(expectedResult);

                const errorMessage = this.getErrorMessage(
                    isSuccess,
                    errorMessages[MatchersTypes.toBeTruthy],
                    expectedResult
                );

                return {
                    isSuccess,
                    errorMessage,
                };
            }
        );
    }

    private getErrorMessage(
        isSuccess: boolean,
        errorMessageCallback: ErrorMessageCallback,
        expectedResult: ExpectedResult,
        actualResult?: ActualResult
    ): string {
        return isSuccess
            ? ''
            : errorMessageCallback(expectedResult, actualResult);
    }

    private setValidatorCallback(validatorCallback: ValidatorCallback): void {
        const { validator } = this;
        validator.validatorResult = validatorCallback();
    }
}
