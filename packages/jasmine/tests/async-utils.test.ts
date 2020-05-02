import { asyncMap, asyncReduce } from '../async-utils';
import {
    AsyncMapCallback,
    AsyncReduceCallback,
} from '../models/async-utils.model';
import { Request } from '../../express/express.model';

interface Result {
    [key: string]: number;
}

describe('#asyncMap', () => {
    let asyncMapCallback: AsyncMapCallback<number, string>;
    let list: Array<number>;

    beforeEach(() => {
        list = [1, 2, 3, 4, 5];
        asyncMapCallback = async (elem: number): Promise<string> =>
            Promise.resolve(String(elem * elem));
    });

    it('should return promise with transformed list', async () => {
        const resultListPromise = asyncMap(list, asyncMapCallback);

        expect(resultListPromise.then).toBeDefined();
        expect(await resultListPromise).toEqual(['1', '4', '9', '16', '25']);
    });
});

describe('#asyncReduce', () => {
    let asyncReduceCallback: AsyncReduceCallback<Result, number>;
    let list: Array<number>;

    beforeEach(() => {
        list = [1, 2, 3, 4, 5];
        asyncReduceCallback = async (
            result: Request,
            elem: number
        ): Promise<Result> => {
            result[String(elem)] = elem * elem;
            return Promise.resolve(result);
        };
    });

    it('should return promise with resulted value', async () => {
        const resultPromise = asyncReduce(list, asyncReduceCallback, {});

        expect(resultPromise.then).toBeDefined();
        expect(await resultPromise).toEqual({
            '1': 1,
            '2': 4,
            '3': 9,
            '4': 16,
            '5': 25,
        });
    });
});
