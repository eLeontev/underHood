/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStore } from './redux';
import { BaseAction, Reducer, ReduxStore } from './redux.model';

interface State {
    index: number;
    value: number;
}
const initialState: State = {
    index: 0,
    value: 0,
};

const SET_VALUE_TO = 'SET_VALUE_TO';
const INCREMENT_INDEX = 'INCREMENT_INDEX';

interface SetValueToPayload {
    value: number;
}
type SetValueTo = {
    type: typeof SET_VALUE_TO;
    payload: SetValueToPayload;
};
type Increment = {
    type: typeof INCREMENT_INDEX;
};

type Actions = Increment | SetValueTo;

const increment = (): Increment => ({
    type: INCREMENT_INDEX,
});

const setValueTo = (value: number): SetValueTo => ({
    type: SET_VALUE_TO,
    payload: {
        value,
    },
});

const reducer: Reducer<State, Actions> = (
    state: State = initialState,
    action: Actions | BaseAction
): State => {
    switch (action.type) {
        case INCREMENT_INDEX: {
            return {
                ...state,
                index: state.index + 1,
            };
        }
        case SET_VALUE_TO: {
            return {
                ...state,
                value: action.payload.value,
            };
        }

        default: {
            return state;
        }
    }
};

describe('integration tests', () => {
    let store: ReduxStore<State, Actions, (state: State) => void>;
    let subscriber1: any;
    let subscriber2: any;

    let unsubscriber1: any;
    let unsubscriber2: any;

    let stateWithSingleIncrement: State;

    beforeEach(() => {
        stateWithSingleIncrement = {
            index: 1,
            value: 0,
        };
        subscriber1 = jest.fn().mockName('subscriber1');
        subscriber2 = jest.fn().mockName('subscriber2');
    });

    beforeEach(() => {
        store = createStore<State, Actions>(reducer);
        unsubscriber1 = store.subscribe(subscriber1);
        unsubscriber2 = store.subscribe(subscriber2);
    });

    it('should get actual state', () => {
        expect(store.getState()).toBe(initialState);
    });

    it('should call subscribers if dispatched action exists', () => {
        store.dispatch(increment());

        expect(subscriber1).toHaveBeenCalledWith(stateWithSingleIncrement);
        expect(subscriber2).toHaveBeenCalledWith(stateWithSingleIncrement);
    });

    it('should not call subscriber which is unsubsribed', () => {
        unsubscriber1();
        store.dispatch(increment());

        expect(subscriber1).not.toHaveBeenCalled();
        expect(subscriber2).toHaveBeenCalledWith(stateWithSingleIncrement);
    });

    it('should do not call subscribers if passed action does not handled in reducer', () => {
        store.dispatch({} as any);
        expect(subscriber1).not.toHaveBeenCalled();
        expect(subscriber2).not.toHaveBeenCalled();
    });

    it('should always update state to actual state value after subscribers are fired', () => {
        subscriber1.mockImplementation((state: State) =>
            expect(state).not.toBe(store.getState())
        );
        store.dispatch(increment());
    });

    it('reducer should always return the same values for not affected fields in actions', () => {
        const value = 123;
        store.dispatch(setValueTo(value));
        expect(store.getState().index).toBe(initialState.index);
        expect(store.getState().value).toBe(value);
    });

    it('should be reason of memory leak till all subscribers will be unsubscribed', () => {
        expect((store as any).subscribers).toEqual([subscriber1, subscriber2]);
        unsubscriber1();
        unsubscriber2();
        expect((store as any).subscribers).toEqual([]);
    });
});
