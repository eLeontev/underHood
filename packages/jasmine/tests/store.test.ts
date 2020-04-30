import { store } from '../store';

describe('store', () => {
    it('should contain required store filelds with initial data', () => {
        expect(store.activeDescriberId).toBeNull();
        expect(store.isDescriberFormingInProgress).toBeFalsy();
        expect(store.describers).toEqual({});
        expect(store.rootDescribersId).toEqual([]);
        expect(store.activeTestCaseIndex).toBeNull();
        expect(store.nextDescriberArguments).toEqual([]);
    });
});
