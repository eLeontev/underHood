import get from 'lodash.get';

import {
    ReduxSubscriber,
    ListenersDataStore,
    ListenerTypes,
    CommonListenerData,
    CustomListenerData,
    ActionListenerData,
} from './redux-subscriber.model';
import {
    ReduxStore,
    Unsubscriber,
    Subscriber,
    BaseAction,
} from '../redux/redux.model';

class SubscriberStore<State, Action extends BaseAction>
    implements ReduxSubscriber<State, Action> {
    private listenersDataStore: ListenersDataStore<Subscriber<State>> = [];
    private customListenerUnsubscriber: Unsubscriber;
    private firedAction: string;

    constructor(private store: ReduxStore<State, Action>) {
        this.activateListenersSubscriber();
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
        listener: Subscriber<State>
    ): Unsubscriber {
        this.setListenerDataToStore({
            pathToListenValue,
            listener,
            listenerType: ListenerTypes.customListener,
        });
        return (): void => this.unsubscribe(listener);
    }
    setActionListener(
        actionsToFire: Array<string>,
        listener: Subscriber<State>
    ): Unsubscriber {
        this.setListenerDataToStore({
            actionsToFire,
            listener,
            listenerType: ListenerTypes.actionListener,
        });
        return (): void => this.unsubscribe(listener);
    }

    private setListenerDataToStore(
        listenerData: CommonListenerData<Subscriber<State>>
    ): void {
        this.listenersDataStore = [...this.listenersDataStore, listenerData];
    }

    private unsubscribe(listenerToUnsubscribe: Subscriber<State>): void {
        this.listenersDataStore = this.listenersDataStore.filter(
            ({ listener }: CommonListenerData<Subscriber<State>>) =>
                listener !== listenerToUnsubscribe
        );
    }

    private activateListenersSubscriber(): void {
        this.customListenerUnsubscriber = this.store.subscribe(
            this.fireCustomListeners
        );
    }

    private fireCustomListeners: Subscriber<State> = (
        newState: State
    ): void => {
        const state = this.getState();

        const firedAction = this.firedAction;
        this.firedAction = null;

        this.listenersDataStore
            .filter(
                this.shouldFireListner.bind(this, state, newState, firedAction)
            )
            .forEach(({ listener }: CommonListenerData<Subscriber<State>>) =>
                listener(newState)
            );
    };

    private shouldFireListner(
        state: State,
        newState: State,
        firedAction: string,
        listenerData: CommonListenerData<Subscriber<State>>
    ): boolean {
        switch (listenerData.listenerType) {
            case ListenerTypes.customListener: {
                return this.shouldFireCustomListener(
                    state,
                    newState,
                    listenerData as CustomListenerData<Subscriber<State>>
                );
            }
            case ListenerTypes.actionListener: {
                return this.shouldFireActionListner(
                    firedAction,
                    listenerData as ActionListenerData<Subscriber<State>>
                );
            }

            default:
                return false;
        }
    }

    private shouldFireCustomListener(
        state: State,
        newState: State,
        { pathToListenValue }: CustomListenerData<Subscriber<State>>
    ): boolean {
        return (
            get(state, pathToListenValue) !== get(newState, pathToListenValue)
        );
    }

    private shouldFireActionListner(
        firedAction: string,
        { actionsToFire }: ActionListenerData<Subscriber<State>>
    ): boolean {
        return actionsToFire.includes(firedAction);
    }
}

export const getStoreWithSubscribers = <State, Action extends BaseAction>(
    store: ReduxStore<State, Action>
): ReduxSubscriber<State, Action> => new SubscriberStore<State, Action>(store);
