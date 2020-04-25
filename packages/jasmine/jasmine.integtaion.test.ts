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
        debugger;
        expect(instance.describers).toEqual({
            'root-1': {
                description: 'root_01',
                beforeEachList: [],
                itList: [],
                childrenDescribersId: ['child-2', 'child-4'],
                context: {},
            },
            'child-2': {
                description: 'child_01_01',
                beforeEachList: [],
                itList: [],
                childrenDescribersId: ['child-3'],
                context: {},
            },
            'child-3': {
                description: 'child_01_01_01',
                beforeEachList: [],
                itList: [],
                childrenDescribersId: [],
                context: {},
            },
            'child-4': {
                description: 'child_01_02',
                beforeEachList: [],
                itList: [],
                childrenDescribersId: [],
                context: {},
            },
            'root-5': {
                description: 'root_02',
                beforeEachList: [],
                itList: [],
                childrenDescribersId: ['child-6'],
                context: {},
            },
            'child-6': {
                description: 'child_02_01',
                beforeEachList: [],
                itList: [],
                childrenDescribersId: [],
                context: {},
            },
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
