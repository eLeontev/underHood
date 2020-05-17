/* eslint-disable @typescript-eslint/no-explicit-any */

import { createStore } from './redux';
import { initialAction } from './redux.constant';

describe('Redux', () => {
    let store: any;
    let reducer: any;

    let subscriber: any;

    const state = 'state';
    const initialState = 'initialState';

    beforeEach(() => {
        reducer = jest
            .fn()
            .mockName('reducer')
            .mockImplementation((state: any = initialState) => state);
        subscriber = jest.fn().mockName('subscriber');
    });

    beforeEach(() => {
        store = createStore(reducer);
    });

    it('should set state on init as the result of call the passed reducer', () => {
        expect(store.state).toBe(initialState);
        expect(reducer).toHaveBeenCalledWith(undefined, initialAction);
    });

    describe('#getState', () => {
        it('should return actual state', () => {
            expect(store.getState()).toBe(initialState);
        });
    });

    describe('#subscribe', () => {
        beforeEach(() => {
            store.unsubscribe = jest.fn().mockName('unsubscribe');
        });

        it('should register subscriber', () => {
            store.subscribe(subscriber);
            expect(store.subscribers).toEqual([subscriber]);
        });

        it('should return unsubscriber which call store #unsubscribe with passed subscriber', () => {
            const unsubscriber = store.subscribe(subscriber);
            expect(store.unsubscribe).not.toHaveBeenCalled();

            unsubscriber();

            expect(store.unsubscribe).toHaveBeenCalledWith(subscriber);
        });
    });

    describe('#dispatch', () => {
        const action = 'action';

        beforeEach(() => {
            store.state = initialState;
            store.fireSubscribers = jest.fn().mockName('fireSubscribers');
            store.updateState = jest.fn().mockName('updateState');
            store.reducer = reducer;
        });

        it('should call reducer with actual state and passed action', () => {
            store.dispatch(action);
            expect(reducer).toHaveBeenCalledWith(initialState, action);
        });

        it('should do nothing if state returned after reducer call is the same as actual', () => {
            store.dispatch(action);
            expect(store.fireSubscribers).not.toHaveBeenCalled();
            expect(store.updateState).not.toHaveBeenCalled();
        });

        it('should fire subscribers if state returned after reducer call is  different with actual', () => {
            reducer.mockImplementation(() => state);
            store.dispatch(action);
            expect(store.fireSubscribers).toHaveBeenCalledWith(state);
        });

        it('should update state based on reducer results after all subscriberss will be fired', () => {
            reducer.mockImplementation(() => state);
            store.updateState.mockImplementation(() =>
                expect(store.fireSubscribers).toHaveBeenCalled()
            );

            store.dispatch(action);

            expect(store.updateState).toHaveBeenCalledWith(state);
        });
    });

    describe('#fireSubscribers', () => {
        it('should call all subscribers with passed state', () => {
            store.subscribers = [subscriber];

            store.fireSubscribers(state);

            expect(subscriber).toHaveBeenCalledWith(state);
        });
    });

    describe('#updateState', () => {
        it('should set state to passed value', () => {
            expect(store.state).toBe(initialState);
            store.updateState(state);
            expect(store.state).toBe(state);
        });
    });

    describe('#unsubscribe', () => {
        it('should remove passed unsubscriber from list of subscribers', () => {
            store.subscribers = [subscriber];
            store.unsubscribe(subscriber);
            expect(store.subscribers).toEqual([]);
        });
    });
});
