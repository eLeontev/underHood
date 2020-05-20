/* eslint-disable @typescript-eslint/no-explicit-any */

import isEqual from 'lodash.isequal';

import { ActualResult, ExpectedResult } from './models/matchers.model';
import { ValidatorMethod } from './models/validators.model';
import { SpyMethod, SpyArguments } from './models/spy.model';

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

    public toBe(
        actualResult: ActualResult,
        ...[expectedResult]: Array<ExpectedResult>
    ): boolean {
        return actualResult === expectedResult;
    }

    public toEqual(
        actualResult: ActualResult,
        ...[expectedResult]: Array<ExpectedResult>
    ): boolean {
        return isEqual(actualResult, expectedResult);
    }

    public toHaveBeenCalled: ValidatorMethod = (
        actualResult: ActualResult
    ): boolean => {
        const { isCalled } = (actualResult as SpyMethod<
            any,
            ActualResult
        >).getSpyProperties();
        return isCalled;
    };

    public toHaveBeenCalledWith: ValidatorMethod = (
        actualResult: ActualResult,
        ...expectedResults: Array<ExpectedResult>
    ): boolean => {
        const { args } = (actualResult as SpyMethod<
            any,
            ActualResult
        >).getSpyProperties();

        return args.some((args: SpyArguments<any>) =>
            isEqual(args, expectedResults)
        );
    };
}
