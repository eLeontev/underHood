import {
    SpyCore,
    SpyMethod,
    SpyProperties,
    CallFake,
    ReturnValue,
    SpyArguments,
} from './models/spy.model';

export class Spy implements SpyCore {
    private spyPropertiesMap: Map<SpyMethod, SpyProperties> = new Map();

    public createSpy = (spyName: string): SpyMethod => {
        return this.getNewRegisterSpy(spyName);
    };

    private getNewRegisterSpy(spyName: string): SpyMethod {
        const spyProperties = this.initSpyProperties(spyName);
        return this.initSpy(spyProperties);
    }

    private initSpyProperties(spyName: string): SpyProperties {
        return {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            handler: (): void => {},
            spyName,
            isCalled: false,
            countOfCalls: 0,
            args: [],
        };
    }

    private initSpy(spyProperties: SpyProperties): SpyMethod {
        const spyMethod: SpyMethod = <HandlerResult>(
            ...args: Array<SpyArguments>
        ): HandlerResult =>
            this.perfromSpyCall<HandlerResult, SpyArguments>(spyMethod, args);

        spyMethod.returnValue = this.getReturnValue(spyMethod);
        spyMethod.callFake = this.getCallFake(spyMethod);

        spyMethod.getSpyProperties = this.getSpyProperties.bind(
            this,
            spyMethod
        );

        this.registerSpyMethod(spyMethod, spyProperties);

        return spyMethod as SpyMethod;
    }

    private registerSpyMethod(
        spyMethod: SpyMethod,
        spyProperties: SpyProperties
    ): void {
        this.spyPropertiesMap.set(spyMethod, spyProperties);
    }

    private perfromSpyCall<HandlerResult, SpyArguments>(
        spyMethod: SpyMethod,
        args: Array<SpyArguments>
    ): HandlerResult {
        const spyProperties = this.getSpyProperties(spyMethod);

        spyProperties.countOfCalls = spyProperties.countOfCalls + 1;
        spyProperties.isCalled = true;
        spyProperties.args = [...spyProperties.args, args];

        return spyProperties.handler(...args);
    }

    private getCallFake(spyMethod: SpyMethod): CallFake {
        return (cb: Function): SpyMethod => {
            const spyProperties = this.getSpyProperties(spyMethod);

            spyProperties.handler = cb;

            return spyMethod;
        };
    }

    private getReturnValue(spyMethod: SpyMethod): ReturnValue {
        return <V>(value: V): SpyMethod => {
            const spyProperties = this.getSpyProperties(spyMethod);

            spyProperties.handler = (): V => value;

            return spyMethod;
        };
    }

    private getSpyProperties(spyMethod: SpyMethod): SpyProperties {
        return this.spyPropertiesMap.get(spyMethod);
    }
}
