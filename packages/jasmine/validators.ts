import { ActualResult } from './models/matchers.model';
import { ValidatorMethod } from './models/validators.model';

export class Validators {
    public toBeFalsy: ValidatorMethod = (
        actualResult: ActualResult
    ): boolean => {
        return !actualResult;
    };

    public toBeTruthy: ValidatorMethod = (
        actualResult: ActualResult
    ): boolean => {
        return Boolean(actualResult);
    };
}
