/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */

import { Jasmine } from '../jasmine';
import { Spy } from '../spy';

export const getTestInstanceWithMockData = () => {
    const instance = new Jasmine();
    const { createSpy } = new Spy();

    const returnValue = 'returnValue';

    let simpleSpy: any;
    let spyWithReturnedvalue: any;
    let spyWithMockImplementation: any;

    let initialValueBfeFirst: number;
    let initialValueBfeSecond: number;
    let initialValueBfeThird: number;

    const bfeCallbackFirst = () => {
        initialValueBfeFirst = 10;
        simpleSpy = createSpy('simpleSpy');
    };
    const bfeCallbackSecond = () => {
        initialValueBfeSecond = initialValueBfeFirst + 10;
        spyWithReturnedvalue = createSpy('spyWithReturnedvalue').returnValue(
            returnValue
        );
    };
    const bfeCallbackThird = () => {
        initialValueBfeThird = initialValueBfeSecond + 10;
        spyWithMockImplementation = createSpy(
            'spyWithMockImplementation'
        ).callFake((arrayOfWords: any) =>
            arrayOfWords.reduce(
                (resultValue: any, word: any) => resultValue + word
            )
        );
    };

    const afeCallbackFirst = () => {};
    const afeCallbackSecond = () => {};
    const afeCallbackThird = () => {};

    const asyncMethod = (delay: number) =>
        new Promise((res) => setTimeout(res, delay));

    const itCallbackFirst = () => {
        instance.expect('without matcher');
        instance.expect(simpleSpy()).toBeFalsy();
        instance.expect(spyWithReturnedvalue()).toBeFalsy();
    };
    const itCallbackSecond = async () => {
        instance.expect('valid').toBeTruthy();
        await asyncMethod(150);
    };
    const itCallbackThird = () => {
        instance
            .expect(
                spyWithMockImplementation(['it', ' ', 'w', 'o', 'r', 'k', 's'])
            )
            .toBeFalsy();
        instance.expect(initialValueBfeThird).toBeFalsy();
    };
    const itCallbackFourth = async () => {
        instance.expect(false).toBeFalsy();
        await asyncMethod(30);

        instance.expect(undefined).toBeFalsy();
        instance.expect(null).toBeFalsy();
    };
    const itCallbackFifth = () => {
        instance.expect('invalid').toBe('invalid');
        instance.expect('invalid').not.toBe('invalid');
        instance.expect('valid').toBe('invalid');
    };
    const itCallbackSixth = async () => {
        instance.expect({ a: [123] }).toEqual({ a: [123] });
        instance.expect({ a: [123] }).not.toEqual({ a: [123] });
        await asyncMethod(1);
        const fn1 = () => ({});
        const fn2 = () => ({});
        instance.expect(fn1).toEqual(fn2);
    };

    instance.describe('root-1', () => {
        instance.beforeEach(bfeCallbackFirst);
        instance.it('it-1', itCallbackFirst);
        instance.describe('child-2', () => {
            instance.afterEach(afeCallbackFirst);

            instance.describe('child-3', () => {
                instance.beforeEach(bfeCallbackThird);
                instance.it('it-3', itCallbackThird);
                instance.afterEach(afeCallbackSecond);
            });
        });

        instance.beforeEach(bfeCallbackSecond);
        instance.describe('child-4', () => {
            instance.it('it-4', itCallbackFourth);
        });

        instance.it('it-2', itCallbackSecond);
    });

    instance.describe('root-5', () => {
        instance.describe('child-6', () => {
            instance.afterEach(afeCallbackThird);
            instance.it('it-6', itCallbackSixth);
        });

        instance.it('it-5', itCallbackFifth);
    });

    return {
        instance,
        bfeCallbackFirst,
        bfeCallbackSecond,
        bfeCallbackThird,
        afeCallbackFirst,
        afeCallbackSecond,
        afeCallbackThird,
        asyncMethod,
        itCallbackFirst,
        itCallbackSecond,
        itCallbackThird,
        itCallbackFourth,
        itCallbackFifth,
        itCallbackSixth,
    };
};
