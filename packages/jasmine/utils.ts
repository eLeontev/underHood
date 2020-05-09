import isFunction from 'lodash.isfunction';

import { ActualResult } from './models/matchers.model';
import { SpyMethod } from './models/spy.model';

export type IsSpy = (actualResult: ActualResult) => boolean;
export const isSpy: IsSpy = (actualResult: ActualResult): boolean =>
    actualResult &&
    isFunction(actualResult) &&
    Boolean((actualResult as SpyMethod).getSpyProperties);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stringifyPassedValue = (passedValue: any): string =>
    isFunction(passedValue)
        ? `function with name: ${passedValue.name}`
        : JSON.stringify(passedValue);
