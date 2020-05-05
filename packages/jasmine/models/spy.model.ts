export type ReturnValue = <V>(value: V) => SpyMethod;
export type CallFake = (cb: Function) => SpyMethod;

export interface SpyMethod {
    (): void;
    returnValue: ReturnValue;
    callFake: CallFake;
}

export interface SpyCore {
    createSpy(spyName: string): SpyMethod;
}

export interface SpyProperties {
    handler: Function;
    spyName: string;
    isCalled: boolean;
    countOfCalls: number;
}
