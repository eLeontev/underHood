import { ActualResult } from './models/matchers.model';
import { SpyAPICore } from './models/spy-api.model';
import { GetActualResultWithSpy } from './models/utils.model';

export const getActualResultWithSpy: GetActualResultWithSpy = (
    actualResult: ActualResult
): ActualResult => {
    let result = actualResult;

    if (actualResult && actualResult.getSpyResult) {
        result = (actualResult as SpyAPICore).getSpyResult();
    }

    return result;
};
