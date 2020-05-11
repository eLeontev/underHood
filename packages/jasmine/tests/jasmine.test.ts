/* eslint-disable @typescript-eslint/no-explicit-any */

import { Jasmine } from '../jasmine';

describe('Jasmine', () => {
    let instance: any;

    beforeEach(() => {
        instance = new Jasmine();
    });

    it('should define test API', () => {
        expect(instance.describe).toBeDefined();
        expect(instance.xdescribe).toBeDefined();

        expect(instance.beforeEach).toBeDefined();
        expect(instance.afterEach).toBeDefined();

        expect(instance.it).toBeDefined();
        expect(instance.xit).toBeDefined();
        expect(instance.fit).toBeDefined();

        expect(instance.expect).toBeDefined();

        expect(instance.run).toBeDefined();
    });
});
