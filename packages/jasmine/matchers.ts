import {
    Validator,
    MatchersCore,
    ValidatorResult,
    ExpectedResult,
    ActualResult,
    MatcherMethod,
} from './models/matchers.model';
import { Validators } from './validators';
import { ValidatorMethod } from './models/validators.model';
import { errorMessages, getErrorMessage } from './error.messages';
import { GetErrorMessage } from './models/error.messages.model';

export enum MatchersTypes {
    testTimeFrameDurationExeeded = 'testTimeFrameDurationExeeded',
    expectDoNothing = 'expectDoNothing',
    toBeFalsy = 'toBeFalsy',
    toBeTruthy = 'toBeTruthy',
}

export class Matchers implements MatchersCore {
    private getErrorMessage: GetErrorMessage = getErrorMessage;

    public toBeFalsy: MatcherMethod;
    public toBeTruthy: MatcherMethod;

    constructor(private validator: Validator, validators: Validators) {
        this.toBeFalsy = this.getValidator(
            validators.toBeFalsy,
            MatchersTypes.toBeFalsy
        );
        this.toBeTruthy = this.getValidator(
            validators.toBeTruthy,
            MatchersTypes.toBeTruthy
        );
    }

    private getValidator(
        validatorMethod: ValidatorMethod,
        errorMessageType: MatchersTypes
    ): (expectedResults: Array<ExpectedResult>) => void {
        return (...expectedResults: Array<ExpectedResult>): void => {
            const actualResult = this.getActualResult();
            const isSuccess = validatorMethod(actualResult, ...expectedResults);

            this.setValidatorResult({
                isSuccess,
                errorMessage: this.getErrorMessage(
                    isSuccess,
                    errorMessages[errorMessageType],
                    actualResult
                ),
            });
        };
    }

    private getActualResult(): ActualResult {
        return this.validator.actualResult;
    }

    private setValidatorResult(validatorResult: ValidatorResult): void {
        const { validator } = this;
        validator.validatorResult = validatorResult;
    }
}
