/* eslint-disable @typescript-eslint/no-explicit-any */

import { getStoreWithSubscribers } from './redux-subscriber';
import { ListenerTypes } from './redux-subscriber.model';

describe('redux-subscriber', () => {
    let store: any;
    let subscribe: any;
    let listener: any;

    const customListenerUnsubscriber = 'customListenerUnsubscriber';
    const state = 'state';
    const newState = 'newState';

    const unsubscriber = 'unsubscriber';
    const cb = 'cb';
    const firedAction = 'firedAction';

    beforeEach(() => {
        listener = jest.fn().mockName('listener');
        subscribe = jest
            .fn()
            .mockName('subscribe')
            .mockReturnValue(customListenerUnsubscriber);
        store = (getStoreWithSubscribers as any)({ subscribe });
    });

    it('should subscribe custom listener on init', () => {
        expect(subscribe).toHaveBeenCalledWith(store.fireCustomListeners);
        expect(store.customListenerUnsubscriber).toBe(
            customListenerUnsubscriber
        );
    });

    describe('#getState', () => {
        it('should return state', () => {
            store.store.getState = jest
                .fn()
                .mockName('getState')
                .mockReturnValue(state);
            expect(store.getState()).toBe(state);
            expect(store.store.getState).toHaveBeenCalled();
        });
    });

    describe('#subscribe', () => {
        it('should subscribe listener and return unsubscriber', () => {
            store.store.subscribe = jest
                .fn()
                .mockName('subscribe')
                .mockReturnValue(unsubscriber);
            expect(store.subscribe(cb)).toBe(unsubscriber);
            expect(store.store.subscribe).toHaveBeenCalledWith(cb);
        });
    });

    describe('#dispatch', () => {
        let action: any;

        beforeEach(() => {
            action = { type: firedAction };
            store.store.dispatch = jest.fn().mockName('dispatch');
        });

        it('should set action type to store to firedAction field', () => {
            store.dispatch(action);
            expect(store.firedAction).toBe(firedAction);
        });

        it('should  call store disaptch with passed action', () => {
            store.dispatch(action);
            expect(store.store.dispatch).toHaveBeenCalledWith(action);
        });
    });

    describe('#unsubscribeCustomListenerSubscriber', () => {
        it('should unsubscribe listener subscribed on store initialization', () => {
            store.customListenerUnsubscriber = jest
                .fn()
                .mockName('customListenerUnsubscriber');
            store.unsubscribeCustomListenerSubscriber();
            expect(store.customListenerUnsubscriber).toHaveBeenCalled();
        });
    });

    describe('specific listeners', () => {
        const pathToListenValue = 'pathToListenValue';
        const actionsToFire = 'actionsToFire';

        beforeEach(() => {
            store.unsubscribe = jest.fn().mockName('unsubscribe');
            store.setListenerDataToStore = jest
                .fn()
                .mockName('setListenerDataToStore');
        });

        describe('#setCustomListener', () => {
            it('should set listener data to store and register listener as custom', () => {
                store.setCustomListener(pathToListenValue, listener);
                expect(store.setListenerDataToStore).toHaveBeenCalledWith({
                    pathToListenValue,
                    listener,
                    listenerType: ListenerTypes.customListener,
                });
            });

            it('should return unsubscribe method call of which unsubscribes passed listener', () => {
                const unsubscriber = store.setCustomListener(
                    pathToListenValue,
                    listener
                );
                expect(store.unsubscribe).not.toHaveBeenCalled();

                unsubscriber();
                expect(store.unsubscribe).toHaveBeenCalledWith(listener);
            });
        });

        describe('#setActionListener', () => {
            it('should set listener data to store and register listener as action', () => {
                store.setActionListener(actionsToFire, listener);
                expect(store.setListenerDataToStore).toHaveBeenCalledWith({
                    actionsToFire,
                    listener,
                    listenerType: ListenerTypes.actionListener,
                });
            });

            it('should return unsubscribe method call of which unsubscribes passed listener', () => {
                const unsubscriber = store.setActionListener(
                    actionsToFire,
                    listener
                );
                expect(store.unsubscribe).not.toHaveBeenCalled();

                unsubscriber();
                expect(store.unsubscribe).toHaveBeenCalledWith(listener);
            });
        });
    });

    describe('#setListenerDataToStore', () => {
        const existedListenerData = 'existedListenerData';
        const listenerData = 'listenerData';

        it('should set listener data to listener data store', () => {
            store.listenersDataStore = [existedListenerData];
            store.setListenerDataToStore(listenerData);
            expect(store.listenersDataStore).toEqual([
                existedListenerData,
                listenerData,
            ]);
        });
    });

    describe('#unsubscribe', () => {
        it('should filter out passed listener from listeners data store', () => {
            store.listenersDataStore = [{ listener }];
            store.unsubscribe(listener);
            expect(store.listenersDataStore).toEqual([]);
        });
    });

    describe('#activateListenersSubscriber', () => {
        it('should subscribe #fireCustomListeners to store', () => {
            store.activateListenersSubscriber();
            expect(store.store.subscribe).toHaveBeenCalledWith(
                store.fireCustomListeners
            );
        });

        it('should set listener unsubscriber to customListenerUnsubscriber field', () => {
            subscribe.customListenerUnsubscriber = null;
            store.activateListenersSubscriber();
            expect(store.customListenerUnsubscriber).toBe(
                customListenerUnsubscriber
            );
        });
    });

    describe('#fireCustomListeners', () => {
        let listenerData: any;

        beforeEach(() => {
            listenerData = { listener };
            store.firedAction = firedAction;
            store.getState = jest
                .fn()
                .mockName('getState')
                .mockReturnValue(state);
            store.shouldFireListner = jest
                .fn()
                .mockName('shouldFireListner')
                .mockReturnValue(true);

            store.listenersDataStore = [listenerData];
        });

        it('should not call listeners which should not be fired', () => {
            store.shouldFireListner.mockReturnValue(false);
            store.fireCustomListeners(newState);
            expect(listener).not.toHaveBeenCalled();
        });

        it('should call listeners which should be fired with new state', () => {
            store.fireCustomListeners(newState);
            expect(listener).toHaveBeenCalledWith(newState);
        });

        it('should call #shouldFireListner with all requierd data: states/fired actions/lsitner data', () => {
            store.fireCustomListeners(newState);
            expect(store.getState).toHaveBeenCalled();
            expect(store.shouldFireListner).toHaveBeenCalledWith(
                state,
                newState,
                firedAction,
                { listener },
                0,
                store.listenersDataStore
            );
        });

        it('should clean up fired action before listners callls', () => {
            listener.mockImplementation(() =>
                expect(store.firedAction).toBeNull()
            );
            store.fireCustomListeners(newState);
        });
    });

    describe('#shouldFireListner', () => {
        let listenerData: any;

        beforeEach(() => {
            listenerData = {};

            store.shouldFireCustomListener = jest
                .fn()
                .mockName('shouldFireCustomListener')
                .mockReturnValue(true);
            store.shouldFireActionListner = jest
                .fn()
                .mockName('shouldFireActionListner')
                .mockReturnValue(true);
        });

        it('should return true if custom listener should be fired', () => {
            listenerData.listenerType = ListenerTypes.customListener;
            expect(
                store.shouldFireListner(
                    state,
                    newState,
                    firedAction,
                    listenerData
                )
            ).toBeTruthy();
            expect(store.shouldFireCustomListener).toHaveBeenCalledWith(
                state,
                newState,
                listenerData
            );
        });

        it('should return true if action listener should be fired', () => {
            listenerData.listenerType = ListenerTypes.actionListener;
            expect(
                store.shouldFireListner(
                    state,
                    newState,
                    firedAction,
                    listenerData
                )
            ).toBeTruthy();
            expect(store.shouldFireActionListner).toHaveBeenCalledWith(
                firedAction,
                listenerData
            );
        });

        it('should return false in other cases', () => {
            expect(
                store.shouldFireListner(
                    state,
                    newState,
                    firedAction,
                    listenerData
                )
            ).toBeFalsy();

            listenerData.listenerType = ListenerTypes.actionListener;
            store.shouldFireActionListner.mockReturnValue(false);
            expect(
                store.shouldFireListner(
                    state,
                    newState,
                    firedAction,
                    listenerData
                )
            ).toBeFalsy();

            listenerData.listenerType = ListenerTypes.customListener;
            store.shouldFireCustomListener.mockReturnValue(false);
            expect(
                store.shouldFireListner(
                    state,
                    newState,
                    firedAction,
                    listenerData
                )
            ).toBeFalsy();
        });
    });

    describe('#shouldFireCustomListener', () => {
        it('should return false if states for passed path to field are the same', () => {
            expect(
                store.shouldFireCustomListener(
                    { a: { b: { c: [1] } } },
                    { a: { b: { c: [1] } } },
                    { pathToListenValue: 'a.b.c[0]' }
                )
            ).toBeFalsy();
        });

        it('should return true if states for passed path to field are different', () => {
            expect(
                store.shouldFireCustomListener(
                    { a: { b: { c: [{}] } } },
                    { a: { b: { c: [{}] } } },
                    { pathToListenValue: 'a.b.c[0]' }
                )
            ).toBeTruthy();
        });
    });

    describe('#shouldFireActionListner', () => {
        it('should return true if listener fired actions includes passed fired action', () => {
            expect(
                store.shouldFireActionListner(firedAction, {
                    actionsToFire: [firedAction],
                })
            ).toBeTruthy();
        });

        it('should return false if listener fired actions does not include passed fired action', () => {
            expect(
                store.shouldFireActionListner(firedAction, {
                    actionsToFire: ['any other actions'],
                })
            ).toBeFalsy();
        });
    });
});
