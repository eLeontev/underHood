import {
    Validator,
    MatchersCore,
    ValidatorResult,
    ExpectedResult,
    ActualResult,
    MatcherMethod,
    VaidatorResultWithErrorCallback,
} from './models/matchers.model';
import { Validators } from './validators';
import { ValidatorMethod } from './models/validators.model';
import { errorMessages, getErrorMessage } from './error.messages';
import { GetErrorMessage } from './models/error.messages.model';
import { GetActualResultWithSpy, IsSpy } from './models/utils.model';
import { getActualResultWithSpy, isSpy } from './utils';

export enum MatchersTypes {
    expectSpy = 'expectSpy',
    testTimeFrameDurationExeeded = 'testTimeFrameDurationExeeded',
    expectDoNothing = 'expectDoNothing',
    toBeFalsy = 'toBeFalsy',
    toBeTruthy = 'toBeTruthy',
    toBe = 'toBe',
    toEqual = 'toEqual',
    toHaveBeenCalled = 'toHaveBeenCalled',
    toHaveBeenCalledWith = 'toHaveBeenCalledWith',
}

const spyMatchers: Array<MatchersTypes> = [
    MatchersTypes.toHaveBeenCalled,
    MatchersTypes.toHaveBeenCalledWith,
];

export class Matchers implements MatchersCore {
    public not: MatchersCore;

    private isSpy: IsSpy = isSpy;
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
        matcherType: MatchersTypes
    ): (expectedResults: Array<ExpectedResult>) => void {
        return (...expectedResults: Array<ExpectedResult>): void => {
            this.setValidatorResult(
                this.getValidatorResult(
                    validatorMethod,
                    matcherType,
                    expectedResults
                )
            );
        };
    }

    private getValidatorResult(
        validatorMethod: ValidatorMethod,
        matcherType: MatchersTypes,
        expectedResults: Array<ExpectedResult>
    ): ValidatorResult {
        const actualResult = this.getActualResult();

        const { isSuccess, errorMessageCallback } = this.isExpectedSpyNotPassed(
            actualResult,
            matcherType
        )
            ? this.getExpectedSpyNotPassedValidatorResult()
            : this.getValidatorResultWithErrorCallback(
                  validatorMethod,
                  actualResult,
                  matcherType,
                  expectedResults
              );

        return {
            isSuccess,
            errorMessage: this.getErrorMessage(
                isSuccess,
                errorMessageCallback,
                this.isNot,
                actualResult,
                ...expectedResults
            ),
        };
    }

    private getValidatorResultWithErrorCallback(
        validatorMethod: ValidatorMethod,
        actualResult: ActualResult,
        matcherType: MatchersTypes,
        expectedResults: Array<ExpectedResult>
    ): VaidatorResultWithErrorCallback {
        const validatorMethodResult = validatorMethod(
            actualResult,
            ...expectedResults
        );
        const isSuccess = this.isNot
            ? !validatorMethodResult
            : validatorMethodResult;

        return {
            isSuccess,
            errorMessageCallback: errorMessages[matcherType],
        };
    }

    private isExpectedSpyNotPassed(
        actualResult: ActualResult,
        matcherType: MatchersTypes
    ): boolean {
        return !this.isSpy(actualResult) && spyMatchers.includes(matcherType);
    }

    private getExpectedSpyNotPassedValidatorResult(): VaidatorResultWithErrorCallback {
        return {
            isSuccess: false,
            errorMessageCallback: errorMessages[MatchersTypes.expectSpy],
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
