import { errorMessages, getErrorMessage } from './error.messages';
import { ValidatorResult, ActualResult } from './models/matchers.model';
import { MatchersTypes } from './matchers';
import { GetErrorMessage } from './models/error.messages.model';
import { ValidatorMethod } from './models/validators.model';

export class Validators {
    private getErrorMessage: GetErrorMessage = getErrorMessage;

    public toBeFalsy: ValidatorMethod = (
        actualResult: ActualResult
    ): ValidatorResult => {
        const isSuccess = !actualResult;

        return {
            isSuccess,
            errorMessage: this.getErrorMessage(
                isSuccess,
                errorMessages[MatchersTypes.toBeFalsy],
                actualResult
            ),
        };
    };

    public toBeTruthy: ValidatorMethod = (
        actualResult: ActualResult
    ): ValidatorResult => {
        const isSuccess = Boolean(actualResult);

        return {
            isSuccess,
            errorMessage: this.getErrorMessage(
                isSuccess,
                errorMessages[MatchersTypes.toBeTruthy],
                actualResult
            ),
        };
    };
}
