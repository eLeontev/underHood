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
import { GetActualResultWithSpy } from './models/utils.model';
import { getActualResultWithSpy } from './utils';

export enum MatchersTypes {
    testTimeFrameDurationExeeded = 'testTimeFrameDurationExeeded',
    expectDoNothing = 'expectDoNothing',
    toBeFalsy = 'toBeFalsy',
    toBeTruthy = 'toBeTruthy',
}

export class Matchers implements MatchersCore {
    public not: MatchersCore;

    private getErrorMessage: GetErrorMessage = getErrorMessage;
    private getActualResultWithSpy: GetActualResultWithSpy = getActualResultWithSpy;

    public toBeFalsy: MatcherMethod;
    public toBeTruthy: MatcherMethod;

    constructor(
        private validator: Validator,
        validators: Validators,
        private isNot?: boolean
    ) {
        this.toBeFalsy = this.getValidator(
            validators.toBeFalsy,
            MatchersTypes.toBeFalsy
        );
        this.toBeTruthy = this.getValidator(
            validators.toBeTruthy,
            MatchersTypes.toBeTruthy
        );

        this.setNotField(validator, validators, isNot);
    }

    private getValidator(
        validatorMethod: ValidatorMethod,
        errorMessageType: MatchersTypes
    ): (expectedResults: Array<ExpectedResult>) => void {
        return (...expectedResults: Array<ExpectedResult>): void => {
            const actualResult = this.getActualResult();
            const validatorMethodResult = validatorMethod(
                actualResult,
                ...expectedResults
            );
            const isSuccess = this.isNot
                ? !validatorMethodResult
                : validatorMethodResult;

            this.setValidatorResult({
                isSuccess,
                errorMessage: this.getErrorMessage(
                    isSuccess,
                    errorMessages[errorMessageType],
                    this.isNot,
                    actualResult
                ),
            });
        };
    }

    private getActualResult(): ActualResult {
        return this.getActualResultWithSpy(this.validator.actualResult);
    }

    private setValidatorResult(validatorResult: ValidatorResult): void {
        const { validator } = this;
        validator.validatorResult = validatorResult;
    }

    private setNotField(
        validator: Validator,
        validators: Validators,
        isNot: boolean
    ): void {
        if (!isNot) {
            this.not = new Matchers(validator, validators, true);
        }
    }
}
