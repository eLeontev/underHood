/* eslint-disable @typescript-eslint/no-explicit-any */

import { SpyAPI } from '../spy-api';

describe('SpyAPI', () => {
    let api: any;

    const spyResult = 'spyResult';

    beforeEach(() => {
        api = new SpyAPI(spyResult);
    });

    describe('#getSpyResult', () => {
        it('should return spy result', () => {
            expect(api.getSpyResult()).toBe(spyResult);
        });
    });
});
