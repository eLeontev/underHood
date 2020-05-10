export type ReturnValue = <V>(value: V) => SpyMethod;
export type CallFake = (cb: Function) => SpyMethod;
export type CallOrigin = () => SpyMethod;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SpyArguments = Array<any>;
export interface SpyMethod {
    (...args: SpyArguments): void;
    returnValue: ReturnValue;
    callFake: CallFake;
    callOrigin?: CallOrigin;
    getSpyProperties(): SpyProperties;
}

export interface SpyCore {
    createSpy(spyName: string): SpyMethod;
}

export interface SpyProperties {
    handler: Function;
    spyName: string;
    isCalled: boolean;
    countOfCalls: number;
    args: Array<SpyArguments>;
    origin?: Function;
}
