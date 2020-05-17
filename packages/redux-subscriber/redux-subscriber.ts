import get from 'lodash.get';

import { ReduxSubscriber } from './redux-subscriber.model';
import {
    ReduxStore,
    Unsubscriber,
    Subscriber,
    BaseAction,
} from '../redux/redux.model';

export interface ListenerData<Listener> {
    listener: Listener;
    actionsToFire: Array<string>;
}

interface ListenersDataStore<Listener> {
    [pathToListenValue: string]: Array<ListenerData<Listener>>;
}

class SubscriberStore<State, Action extends BaseAction>
    implements ReduxSubscriber<State, Action> {
    private listenersDataStore: ListenersDataStore<Subscriber<State>> = {};
    private customListenerUnsubscriber: Unsubscriber;
    private firedAction: string;

    constructor(private store: ReduxStore<State, Action>) {
        this.activateCustomListenersSubscriber();
    }

    getState(): State {
        return this.store.getState();
    }
    subscribe(cb: Subscriber<State>): Unsubscriber {
        return this.store.subscribe(cb);
    }
    dispatch(action: Action): void {
        this.firedAction = action.type;
        this.store.dispatch(action);
    }
    unsubscribeCustomListenerSubscriber(): void {
        this.customListenerUnsubscriber();
    }
    setCustomListener(
        pathToListenValue: string,
        listener: Subscriber<State>,
        actionsToFire: string[] = []
    ): Unsubscriber {
        this.setListenerDataToStore(pathToListenValue, listener, actionsToFire);
        return (): void => this.unsubscribe(pathToListenValue, listener);
    }

    private setListenerDataToStore(
        pathToListenValue: string,
        listener: Subscriber<State>,
        actionsToFire: string[]
    ): void {
        const listenersData = this.listenersDataStore[pathToListenValue];
        const listenerData: ListenerData<Subscriber<State>> = {
            actionsToFire,
            listener,
        };

        this.listenersDataStore[pathToListenValue] = [
            ...listenersData,
            listenerData,
        ];
    }

    private unsubscribe(
        pathToListenValue: string,
        listenerToUnsubscribe: Subscriber<State>
    ): void {
        this.listenersDataStore[pathToListenValue] = this.listenersDataStore[
            pathToListenValue
        ].filter(
            ({ listener }: ListenerData<Subscriber<State>>) =>
                listener !== listenerToUnsubscribe
        );
    }

    private activateCustomListenersSubscriber(): void {
        this.customListenerUnsubscriber = this.store.subscribe(
            this.fireCustomListeners
        );
    }

    private fireCustomListeners: Subscriber<State> = (
        newState: State
    ): void => {
        const firedAction = this.firedAction;
        this.firedAction = null;

        const state = this.getState();
        Object.keys(this.listenersDataStore)
            .filter(this.isStateChangedInPath.bind(null, state, newState))
            .forEach(
                this.fireCustomListenersForChangedPath.bind(
                    this,
                    newState,
                    firedAction
                )
            );
    };

    private isStateChangedInPath(
        state: State,
        newState: State,
        pathToListenValue: string
    ): boolean {
        return (
            get(state, pathToListenValue) !== get(newState, pathToListenValue)
        );
    }

    private fireCustomListenersForChangedPath(
        state: State,
        firedAction: string,
        pathToListenValue: string
    ): void {
        this.listenersDataStore[pathToListenValue]
            .filter(this.sholdFireListener.bind(null, firedAction))
            .forEach(this.fireListener.bind(null, state));
    }

    private sholdFireListener(
        firedAction: string,
        { actionsToFire }: ListenerData<Subscriber<State>>
    ): boolean {
        const shouldBeFiredAlways = !actionsToFire.length;
        return shouldBeFiredAlways || actionsToFire.includes(firedAction);
    }

    private fireListener(
        state: State,
        { listener }: ListenerData<Subscriber<State>>
    ): void {
        listener(state);
    }
}

export const getStoreWithSubscribers = <State, Action extends BaseAction>(
    store: ReduxStore<State, Action>
): ReduxSubscriber<State, Action> => new SubscriberStore<State, Action>(store);
