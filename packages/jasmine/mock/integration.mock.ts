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

    const bfeCallbackFirst = () => {
        simpleSpy = createSpy('simpleSpy');
    };
    const bfeCallbackSecond = () => {
        spyWithReturnedvalue = createSpy('spyWithReturnedvalue').returnValue(
            returnValue
        );
    };
    const bfeCallbackThird = () => {
        spyWithMockImplementation = createSpy(
            'spyWithMockImplementation'
        ).callFake((arrayOfWords: Array<string>) =>
            arrayOfWords.reduce((resultValue, word) => resultValue + word)
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
    };
    const itCallbackFourth = async () => {
        instance.expect(false).toBeFalsy();
        await asyncMethod(30);

        instance.expect(undefined).toBeFalsy();
        instance.expect(null).toBeFalsy();
    };
    const itCallbackFifth = () => {
        instance.expect('invalid').not.toBeFalsy();
        instance.expect('valid').not.toBeTruthy();
    };
    const itCallbackSixth = async () => {
        instance.expect(0).toBeFalsy();
        await asyncMethod(1);
        instance.expect('').toBeFalsy();
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
