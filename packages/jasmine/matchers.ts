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

export enum MatchersTypes {
    testTimeFrameDurationExeeded = 'testTimeFrameDurationExeeded',
    expectDoNothing = 'expectDoNothing',
    toBeFalsy = 'toBeFalsy',
    toBeTruthy = 'toBeTruthy',
}

export class Matchers implements MatchersCore {
    public toBeFalsy: MatcherMethod;
    public toBeTruthy: MatcherMethod;

    constructor(private validator: Validator, validators: Validators) {
        this.toBeFalsy = this.getValidator(validators.toBeFalsy);
        this.toBeTruthy = this.getValidator(validators.toBeTruthy);
    }

    private getValidator(
        validatorMethod: ValidatorMethod
    ): (expectedResults: Array<ExpectedResult>) => void {
        return (...expectedResults: Array<ExpectedResult>): void => {
            this.setValidatorResult(
                validatorMethod(this.getActualResult(), ...expectedResults)
            );
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
