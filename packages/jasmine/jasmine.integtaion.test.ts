/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any */

import { Describe } from './describe';

const instance: any = new Describe();

instance.describe('root_01', () => {
    instance.describe('child_01_01', () => {
        instance.describe('child_01_01_01', Function);
    });

    instance.describe('child_01_02', Function);
});

instance.describe('root_02', () => {
    instance.describe('child_02_01', Function);
});

describe('Integration tests: Describe', () => {
    it('should form valid relationship structure of describers', () => {
        expect(instance.describers).toEqual({
            'child-2': {
                description: 'child_01_01_01',
                beforeEachList: [],
                itList: [],
                childrenDescribersId: [],
                context: {},
            },
            'child-1': {
                description: 'child_01_01',
                beforeEachList: [],
                itList: [],
                childrenDescribersId: ['child-2'],
                context: {},
            },
            'child-3': {
                description: 'child_01_02',
                beforeEachList: [],
                itList: [],
                childrenDescribersId: [],
                context: {},
            },
            'root-4': {
                description: 'root_01',
                beforeEachList: [],
                itList: [],
                childrenDescribersId: ['child-1', 'child-3'],
                context: {},
            },
            'child-5': {
                description: 'child_02_01',
                beforeEachList: [],
                itList: [],
                childrenDescribersId: [],
                context: {},
            },
            'root-6': {
                description: 'root_02',
                beforeEachList: [],
                itList: [],
                childrenDescribersId: ['child-5'],
                context: {},
            },
        });
    });

    it('should collect root describers id in separate list', () => {
        expect(instance.rootDescribersId).toEqual(['root-4', 'root-6']);
    });

    it('should link children describers in parent', () => {
        expect(instance.describers['root-4'].childrenDescribersId).toEqual([
            'child-1',
            'child-3',
        ]);
        expect(instance.describers['root-6'].childrenDescribersId).toEqual([
            'child-5',
        ]);
        expect(instance.describers['child-1'].childrenDescribersId).toEqual([
            'child-2',
        ]);
        expect(instance.describers['child-2'].childrenDescribersId).toEqual([]);
        expect(instance.describers['child-3'].childrenDescribersId).toEqual([]);
        expect(instance.describers['child-5'].childrenDescribersId).toEqual([]);
    });
});
