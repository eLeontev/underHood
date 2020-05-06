import { Store } from './models/store.model';

export const store: Store = {
    activeDescriberId: null,
    isDescriberFormingInProgress: false,
    describers: {},
    rootDescribersId: [],
    activeTestCaseIndex: null,
    nextDescriberArguments: [],
    inactiveDescribers: [],
    inactiveTestCases: [],
};
