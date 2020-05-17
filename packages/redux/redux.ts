import {
    ReduxStore,
    Reducer,
    Unsubscriber,
    Subscriber,
    BaseAction,
} from './redux.model';
import { initialAction } from './redux.constant';

export const createStore = <State, Action extends BaseAction>(
    reducer: Reducer<State, Action>
): ReduxStore<State, Action> => {
    class Store<State, Action extends BaseAction>
        implements ReduxStore<State, Action> {
        private state: State;
        private subscribers: Array<Subscriber<State>> = [];

        constructor(private reducer: Reducer<State, Action>) {
            this.state = reducer(undefined, initialAction);
        }

        getState(): State {
            return this.state;
        }
        subscribe(cb: Subscriber<State>): Unsubscriber {
            this.subscribers = [...this.subscribers, cb];
            return (): void => this.unsubscribe(cb);
        }
        dispatch(action: Action): void {
            const state = this.reducer(this.state, action);

            if (this.state !== state) {
                this.fireSubscribers(state);
                this.updateState(state);
            }
        }

        private fireSubscribers(state: State): void {
            this.subscribers.forEach((cb: Subscriber<State>) => cb(state));
        }

        private updateState(state: State): void {
            this.state = state;
        }

        private unsubscribe(cb: Subscriber<State>): void {
            this.subscribers = this.subscribers.filter(
                (subscriber: Subscriber<State>): boolean => subscriber !== cb
            );
        }
    }

    return new Store<State, Action>(reducer);
};
