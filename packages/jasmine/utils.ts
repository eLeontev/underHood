import { ActualResult } from './models/matchers.model';
import { SpyAPICore } from './models/spy-api.model';
import { GetActualResultWithSpy, IsSpy } from './models/utils.model';

export const isSpy: IsSpy = (actualResult: ActualResult): boolean =>
    actualResult && Boolean(actualResult.getSpyResult);

export const getActualResultWithSpy: GetActualResultWithSpy = (
    actualResult: ActualResult
): ActualResult => {
    let result = actualResult;

    if (isSpy(actualResult)) {
        result = (actualResult as SpyAPICore).getSpyResult();
    }

    return result;
};
