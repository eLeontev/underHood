export type Selector<S, R> = (state: S) => R;
export type CreateSelector = <S, P, R>(
    preparator: (state: S) => P,
    calculator: (prreparatorResult: P) => R
) => Selector<S, R>;
