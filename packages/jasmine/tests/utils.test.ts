/* eslint-disable @typescript-eslint/no-explicit-any */

import { isSpy, getActualResultWithSpy } from '../utils';

describe('#isSpy', () => {
    it('should return true if passed actual result is spy', () => {
        expect(isSpy({ getSpyResult: true })).toBeTruthy();
    });

    it('should return false if passed actual result is spy', () => {
        expect(isSpy(undefined)).toBeFalsy();
    });
});

describe('#getActualResultWithSpy', () => {
    const actualResult = 'actualResult';
    const actualSpyResult = 'actualSpyResult';
    let spyActualResult: any;
    let getSpyResult: any;

    beforeEach(() => {
        getSpyResult = jest
            .fn()
            .mockName('getSpyResult')
            .mockReturnValue(actualSpyResult);

        spyActualResult = {
            getSpyResult,
        };
    });

    it('should return passed actual result for not spy results', () => {
        expect(getActualResultWithSpy(actualResult)).toBe(actualResult);
        expect(getSpyResult).not.toHaveBeenCalled();
    });

    it('should return spy actual result for spy results', () => {
        expect(getActualResultWithSpy(spyActualResult)).toBe(actualSpyResult);
        expect(getSpyResult).toHaveBeenCalled();
    });
});
