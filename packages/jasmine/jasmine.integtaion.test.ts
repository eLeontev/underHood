/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function */

import { Jasmine } from './jasmine';

const instance: any = new Jasmine();

const bfeCallbackFirst = () => {};
const bfeCallbackSecond = () => {};
const bfeCallbackThird = () => {};

const afeCallbackFirst = () => {};
const afeCallbackSecond = () => {};
const afeCallbackThird = () => {};

const itCallbackFirst = () => {};
const itCallbackSecond = () => {};
const itCallbackThird = () => {};
const itCallbackFourth = () => {};
const itCallbackFifth = () => {};
const itCallbackSixth = () => {};

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

describe('Integration tests: Describe', () => {
    describe('should form valid relationship structure of describers for:', () => {
        it('"root-1": should form valid relationship structure of describers', () => {
            expect(instance.describers['root-1']).toEqual({
                description: 'root-1',
                beforeEachList: [bfeCallbackFirst, bfeCallbackSecond],
                afterEachList: [],
                itList: [
                    { description: 'it-1', callback: itCallbackFirst },
                    { description: 'it-2', callback: itCallbackSecond },
                ],
                childrenDescribersId: ['child-2', 'child-4'],
                context: {},
            });
        });

        it('"root-5": should form valid relationship structure of describers', () => {
            expect(instance.describers['root-5']).toEqual({
                description: 'root-5',
                beforeEachList: [],
                afterEachList: [],
                itList: [{ description: 'it-5', callback: itCallbackFifth }],
                childrenDescribersId: ['child-6'],
                context: {},
            });
        });

        it('"child-2": should form valid relationship structure of describers', () => {
            expect(instance.describers['child-2']).toEqual({
                description: 'child-2',
                beforeEachList: [],
                afterEachList: [afeCallbackFirst],
                itList: [],
                childrenDescribersId: ['child-3'],
                context: {},
            });
        });

        it('"child-3": should form valid relationship structure of describers', () => {
            expect(instance.describers['child-3']).toEqual({
                description: 'child-3',
                beforeEachList: [bfeCallbackThird],
                afterEachList: [afeCallbackSecond],
                itList: [{ description: 'it-3', callback: itCallbackThird }],
                childrenDescribersId: [],
                context: {},
            });
        });

        it('"child-4": should form valid relationship structure of describers', () => {
            expect(instance.describers['child-4']).toEqual({
                description: 'child-4',
                beforeEachList: [],
                afterEachList: [],
                itList: [{ description: 'it-4', callback: itCallbackFourth }],
                childrenDescribersId: [],
                context: {},
            });
        });

        it('"child-6": should form valid relationship structure of describers', () => {
            expect(instance.describers['child-6']).toEqual({
                description: 'child-6',
                beforeEachList: [],
                afterEachList: [afeCallbackThird],
                itList: [{ description: 'it-6', callback: itCallbackSixth }],
                childrenDescribersId: [],
                context: {},
            });
        });
    });

    it('should collect root describers id in separate list', () => {
        expect(instance.rootDescribersId).toEqual(['root-1', 'root-5']);
    });

    it('should link children describers in parent', () => {
        expect(instance.describers['root-1'].childrenDescribersId).toEqual([
            'child-2',
            'child-4',
        ]);
        expect(instance.describers['root-5'].childrenDescribersId).toEqual([
            'child-6',
        ]);
        expect(instance.describers['child-2'].childrenDescribersId).toEqual([
            'child-3',
        ]);
        expect(instance.describers['child-3'].childrenDescribersId).toEqual([]);
        expect(instance.describers['child-4'].childrenDescribersId).toEqual([]);
        expect(instance.describers['child-6'].childrenDescribersId).toEqual([]);
    });
});
