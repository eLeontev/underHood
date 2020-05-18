import { CreateSelector, Selector } from './reselect.model';

export const createSelector: CreateSelector = <State, PreparatorResult, Result>(
    preparator: (state: State) => PreparatorResult,
    calculator: (preparatorResult: PreparatorResult) => Result
): Selector<State, Result> => {
    let hashState: State;
    let hashResult: Result;

    return (state: State): Result => {
        if (hashState === state) {
            return hashResult;
        }

        hashState = state;
        hashResult = calculator(preparator(state));

        return hashResult;
    };
};
