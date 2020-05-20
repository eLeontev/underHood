export type ReturnValue<A, R> = (value: R) => SpyMethod<A, R>;
export type CallFake<A, R> = (
    cb: (...spyArgumnents: Array<A>) => R
) => SpyMethod<A, R>;
export type CallOrigin<A, R> = () => SpyMethod<A, R>;

export type SpyArguments<A> = Array<A>;
export interface SpyMethod<A, R> {
    (...spyArgumnents: Array<A>): R;
    returnValue: ReturnValue<A, R>;
    callFake: CallFake<A, R>;
    callOrigin?: CallOrigin<A, R>;
    getSpyProperties(): SpyProperties<A, R>;
}

export interface SpyCore {
    createSpy<SpyArguments, Result>(
        spyName: string
    ): SpyMethod<SpyArguments, Result>;
}

export interface SpyProperties<SpyArguments, Result> {
    handler(...spyArgumnents: Array<SpyArguments>): Result;
    spyName: string;
    isCalled: boolean;
    countOfCalls: number;
    args: Array<Array<SpyArguments>>;
    origin?(...spyArgumnents: Array<SpyArguments>): Result;
}
