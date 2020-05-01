/* eslint-disable @typescript-eslint/no-explicit-any */

import { Jasmine } from '../jasmine';

describe('Jasmine', () => {
    let instance: any;

    beforeEach(() => {
        instance = new Jasmine();
    });

    it('should define test API', () => {
        expect(instance.expect).toBeDefined();
        expect(instance.it).toBeDefined();
        expect(instance.beforeEach).toBeDefined();
        expect(instance.afterEach).toBeDefined();
        expect(instance.describe).toBeDefined();
        expect(instance.run).toBeDefined();
    });
});
