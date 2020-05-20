/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    SpyCore,
    SpyMethod,
    SpyProperties,
    CallFake,
    ReturnValue,
    CallOrigin,
} from './models/spy.model';

export class Spy implements SpyCore {
    private spyPropertiesMap: Map<
        SpyMethod<any, any>,
        SpyProperties<any, any>
    > = new Map();

    public spyMethod = <
        SpyArguments,
        Result,
        Context extends {
            [method: string]: (...spyArguments: Array<SpyArguments>) => Result;
        },
        MethodName extends keyof Context
    >(
        context: Context,
        methodName: MethodName,
        spyArguments: Array<SpyArguments> = [],
        result: Result = undefined
    ): SpyMethod<SpyArguments, Result> => {
        const spyMethod = this.getNewRegisterSpy<SpyArguments, Result>(
            methodName as string,
            spyArguments,
            result
        );
        this.setOrigin<SpyArguments, Result, Context, MethodName>(
            spyMethod,
            context,
            methodName
        );
        spyMethod.callOrigin = this.getCallOrigin(spyMethod);

        return spyMethod;
    };

    public createSpy = <SpyArguments, Result>(
        spyName: string,
        spyArguments: Array<SpyArguments> = [],
        result: Result = undefined
    ): SpyMethod<SpyArguments, Result> => {
        return this.getNewRegisterSpy<SpyArguments, Result>(
            spyName,
            spyArguments,
            result
        );
    };

    private getNewRegisterSpy<SpyArguments, Result>(
        spyName: string,
        spyArguments: Array<SpyArguments>,
        result: Result
    ): SpyMethod<SpyArguments, Result> {
        const spyProperties = this.initSpyProperties<SpyArguments, Result>(
            spyName,
            spyArguments,
            result
        );
        return this.initSpy<SpyArguments, Result>(spyProperties);
    }

    private initSpyProperties<SpyArguments, Result>(
        spyName: string,
        spyArguments: Array<SpyArguments>,
        result: Result
    ): SpyProperties<SpyArguments, Result> {
        return {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            handler: (...spyArguments: Array<SpyArguments>): Result => result,
            spyName,
            isCalled: false,
            countOfCalls: 0,
            args: [],
        };
    }

    private initSpy<SpyArguments, Result>(
        spyProperties: SpyProperties<SpyArguments, Result>
    ): SpyMethod<SpyArguments, Result> {
        const spyMethod: SpyMethod<SpyArguments, Result> = <HandlerResult>(
            ...spyArguments: Array<SpyArguments>
        ): Result =>
            this.perfromSpyCall<SpyArguments, Result>(spyMethod, spyArguments);

        spyMethod.returnValue = this.getReturnValue(spyMethod);
        spyMethod.callFake = this.getCallFake(spyMethod);

        spyMethod.getSpyProperties = (): SpyProperties<SpyArguments, Result> =>
            this.getSpyProperties<SpyArguments, Result>(spyMethod);

        this.registerSpyMethod(spyMethod, spyProperties);

        return spyMethod as SpyMethod<SpyArguments, Result>;
    }

    private registerSpyMethod<SpyArguments, Result>(
        spyMethod: SpyMethod<SpyArguments, Result>,
        spyProperties: SpyProperties<SpyArguments, Result>
    ): void {
        this.spyPropertiesMap.set(spyMethod, spyProperties);
    }

    private perfromSpyCall<SpyArguments, Result>(
        spyMethod: SpyMethod<SpyArguments, Result>,
        args: Array<SpyArguments>
    ): Result {
        const spyProperties = this.getSpyProperties(spyMethod);

        spyProperties.countOfCalls = spyProperties.countOfCalls + 1;
        spyProperties.isCalled = true;
        spyProperties.args = [...spyProperties.args, args];

        return spyProperties.handler(...args);
    }

    private getCallFake<SpyArguments, Result>(
        spyMethod: SpyMethod<SpyArguments, Result>
    ): CallFake<SpyArguments, Result> {
        return (
            cb: (...spyArguments: Array<SpyArguments>) => Result
        ): SpyMethod<SpyArguments, Result> => {
            const spyProperties = this.getSpyProperties<SpyArguments, Result>(
                spyMethod
            );

            spyProperties.handler = cb;

            return spyMethod;
        };
    }

    private getReturnValue<SpyArguments, Result>(
        spyMethod: SpyMethod<SpyArguments, Result>
    ): ReturnValue<SpyArguments, Result> {
        return (value: Result): SpyMethod<SpyArguments, Result> => {
            const spyProperties = this.getSpyProperties(spyMethod);

            spyProperties.handler = (
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                ...spyArguments: Array<SpyArguments>
            ): Result => value;

            return spyMethod;
        };
    }

    private getCallOrigin<SpyArguments, Result>(
        spyMethod: SpyMethod<SpyArguments, Result>
    ): CallOrigin<SpyArguments, Result> {
        return (): SpyMethod<SpyArguments, Result> => {
            const spyProperties = this.getSpyProperties<SpyArguments, Result>(
                spyMethod
            );

            spyProperties.handler = spyProperties.origin;

            return spyMethod;
        };
    }

    private setOrigin<
        SpyArguments,
        Result,
        Context extends {
            [method: string]: (...spyArguments: Array<SpyArguments>) => Result;
        },
        MethodName extends keyof Context
    >(
        spyMethod: SpyMethod<SpyArguments, Result>,
        context: Context,
        methodName: MethodName
    ): void {
        const spyProperties = this.getSpyProperties(spyMethod);
        spyProperties.origin = context[methodName];
    }

    private getSpyProperties<SpyArguments, Result>(
        spyMethod: SpyMethod<SpyArguments, Result>
    ): SpyProperties<SpyArguments, Result> {
        return this.spyPropertiesMap.get(spyMethod);
    }
}
