import {
    ReduxStore,
    Unsubscriber,
    Subscriber,
    BaseAction,
} from '../redux/redux.model';

export interface ReduxSubscriber<State, Action extends BaseAction>
    extends ReduxStore<State, Action> {
    setCustomListener(
        pathToListenValue: string,
        listener: Subscriber<State>,
        actionsToFire: Array<string>
    ): Unsubscriber;
}
