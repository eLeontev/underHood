/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    isSpy,
    stringifyPassedValue,
    getDescriberIdWithPrefix,
} from '../utils';

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

describe('#stringifyPassedValue', () => {
    it('should return string with function name if function passed', () => {
        const spy: any = () => true;
        expect(stringifyPassedValue(spy)).toBe('function with name: spy');
    });

    it('should return stringified value for other cases', () => {
        expect(stringifyPassedValue({ a: 1, b: ['str'] })).toBe(
            '{"a":1,"b":["str"]}'
        );
    });
});

describe('#getDescriberIdWithPrefix', () => {
    const prefix = 'prefix';

    it('should prefix as it is for not fdescribe', () => {
        expect(getDescriberIdWithPrefix(false, prefix)).toBe(prefix);
    });

    it('should modified prefix for  fdescribe', () => {
        expect(getDescriberIdWithPrefix(true, prefix)).toBe(`f${prefix}`);
    });
});
