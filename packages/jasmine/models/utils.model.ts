import { ActualResult } from './matchers.model';

export type IsSpy = (actualResult: ActualResult) => boolean;
export type GetActualResultWithSpy = (
    actualResult: ActualResult
) => ActualResult;
