import { Express } from './express';

describe('Express', () => {
    it('test', () => {
        const { a } = new Express();
        expect(a).toBe(10);
    });
});
