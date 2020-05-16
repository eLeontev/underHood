import { ReduxStore, Reducer, Unsubscriber } from './redux.model';
import { baseAction } from './redux.constant';

export const createStore = <State, Action>(
    reducer: Reducer<State, Action>
): ReduxStore<State, Action, (state: State) => void> => {
    class Store<State, Action, Callback extends Function>
        implements ReduxStore<State, Action, Callback> {
        private state: State;
        private subscribers: Array<Callback> = [];

        constructor(private reducer: Reducer<State, Action>) {
            this.state = reducer(undefined, baseAction);
        }

        getState(): State {
            return this.state;
        }
        subscribe(cb: Callback): Unsubscriber {
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
            this.subscribers.forEach((cb: Callback) => cb(state));
        }

        private updateState(state: State): void {
            this.state = state;
        }

        private unsubscribe(cb: Callback): void {
            this.subscribers = this.subscribers.filter(
                (subscriber: Callback): boolean => subscriber !== cb
            );
        }
    }

    return new Store<State, Action, (state: State) => void>(reducer);
};
