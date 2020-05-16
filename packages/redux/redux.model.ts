export const INIT_STATE = 'INIT_STATE';
export type BaseAction = {
    type: typeof INIT_STATE;
};

export type Reducer<State, Action> = (
    state: State,
    action: Action | BaseAction
) => State;
export type Unsubscriber = () => void;

export interface ReduxStore<State, Action, Callback extends Function> {
    getState(): State;
    subscribe(cb: Callback): Unsubscriber;
    dispatch(action: Action | BaseAction): void;
}
