export interface BaseAction {
    type: string;
}

export const INIT_STATE = 'INIT_STATE';
export interface InitialAction {
    type: typeof INIT_STATE;
}

export type Reducer<State, Action extends BaseAction> = (
    state: State,
    action: Action | InitialAction
) => State;
export type Unsubscriber = () => void;

export type Subscriber<State> = (state: State) => void;

export interface ReduxStore<State, Action extends BaseAction> {
    getState(): State;
    subscribe(cb: Subscriber<State>): Unsubscriber;
    dispatch(action: Action | InitialAction): void;
}
