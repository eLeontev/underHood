/* eslint-disable @typescript-eslint/no-explicit-any */

import { isSpy } from '../utils';

describe('#isSpy', () => {
    it('should return true if passed actual result is spy', () => {
        const spy: any = () => true;
        spy.getSpyProperties = true;
        expect(isSpy(spy)).toBeTruthy();
    });

    it('should return false if passed actual result is spy', () => {
        const notSpy: any = () => true;
        expect(isSpy(notSpy)).toBeFalsy();
        expect(isSpy(undefined)).toBeFalsy();
    });
});
