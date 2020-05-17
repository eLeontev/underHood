import {
    ReduxStore,
    Unsubscriber,
    Subscriber,
    BaseAction,
} from '../redux/redux.model';

export enum ListenerTypes {
    customListener = 'customListener',
    actionListener = 'actionListener',
}

export interface CustomListenerData<Listener> {
    listener: Listener;
    pathToListenValue: string;
    listenerType: ListenerTypes;
}

export interface ActionListenerData<Listener> {
    listener: Listener;
    actionsToFire: Array<string>;
    listenerType: ListenerTypes;
}

export type CommonListenerData<T> =
    | CustomListenerData<T>
    | ActionListenerData<T>;
export type ListenersDataStore<T> = Array<CommonListenerData<T>>;

export interface ReduxSubscriber<State, Action extends BaseAction>
    extends ReduxStore<State, Action> {
    setCustomListener(
        pathToListenValue: string,
        listener: Subscriber<State>
    ): Unsubscriber;
    setActionListener(
        actionsToFire: Array<string>,
        listener: Subscriber<State>
    ): Unsubscriber;
}
