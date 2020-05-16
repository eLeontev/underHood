/* eslint-disable @typescript-eslint/no-explicit-any */

import { Spy } from '../spy';

describe('Spy', () => {
    let instance: any;

    let spyProperties: any;
    let spyMethod: any;
    let args: any;

    const spyName = 'spyName';
    const spyResult = 'spyResult';

    beforeEach(() => {
        spyProperties = 'spyProperties';
        spyMethod = 'spyMethod';
        args = ['a', 'r', 'g', 's'];
    });

    beforeEach(() => {
        instance = new Spy();
    });

    it('should define empty map of spy properties on init', () => {
        expect(instance.spyPropertiesMap.size).toBe(0);
    });

    describe('#spyMethod', () => {
        let spy: any;
        const callOrigin: any = 'callOrigin';
        const context: any = 'context';
        const merthodName: any = 'merthodName';

        beforeEach(() => {
            spy = {};
            instance.getNewRegisterSpy = jest
                .fn()
                .mockName('getNewRegisterSpy')
                .mockReturnValue(spy);
            instance.setOrigin = jest.fn().mockName('setOrigin');
            instance.getCallOrigin = jest
                .fn()
                .mockName('getCallOrigin')
                .mockReturnValue(callOrigin);
        });

        it('should return spy', () => {
            expect(instance.spyMethod(context, merthodName)).toBe(spy);
        });

        it('should register new stected spy, set its origin implimentation and set callOrigin methods', () => {
            instance.spyMethod(context, merthodName);

            expect(instance.getNewRegisterSpy).toHaveBeenCalledWith(
                merthodName
            );
            expect(instance.setOrigin).toHaveBeenCalledWith(
                spy,
                context,
                merthodName
            );
            expect(instance.getCallOrigin).toHaveBeenCalledWith(spy);
            expect(spy.callOrigin).toBe(callOrigin);
        });
    });

    describe('#createSpy', () => {
        const spy: any = 'spy';
        beforeEach(() => {
            instance.getNewRegisterSpy = jest
                .fn()
                .mockName('getNewRegisterSpy')
                .mockReturnValue(spy);
        });

        it('should return new created spy', () => {
            expect(instance.createSpy(spyName)).toBe(spy);
            expect(instance.getNewRegisterSpy).toHaveBeenCalledWith(spyName);
        });
    });

    describe('#initSpyProperties', () => {
        it('should return initial spy properties', () => {
            const spyProperties = instance.initSpyProperties(spyName);

            expect(spyProperties.handler()).toBeUndefined();
            expect(spyProperties.spyName).toBe(spyName);
            expect(spyProperties.isCalled).toBeFalsy();
            expect(spyProperties.countOfCalls).toBe(0);
        });
    });

    describe('#initSpy', () => {
        const returnValue = 'returnValue';
        const callFake = 'callFake';

        beforeEach(() => {
            instance.perfromSpyCall = jest
                .fn()
                .mockName('perfromSpyCall')
                .mockReturnValue(spyResult);
            instance.getReturnValue = jest
                .fn()
                .mockName('getReturnValue')
                .mockReturnValue(returnValue);
            instance.getCallFake = jest
                .fn()
                .mockName('getCallFake')
                .mockReturnValue(callFake);
            instance.registerSpyMethod = jest
                .fn()
                .mockName('registerSpyMethod');
        });

        it('should create and return spy method', () => {
            spyMethod = instance.initSpy(spyProperties);
            expect(instance.perfromSpyCall).not.toHaveBeenCalled();

            expect(spyMethod(...args)).toBe(spyResult);
            expect(instance.perfromSpyCall).toHaveBeenCalledWith(
                spyMethod,
                args
            );
        });

        it('should register new created spy and assign to it spy method', () => {
            spyMethod = instance.initSpy(spyProperties);

            expect(instance.getReturnValue).toHaveBeenCalledWith(spyMethod);
            expect(instance.getCallFake).toHaveBeenCalledWith(spyMethod);

            expect(instance.registerSpyMethod).toHaveBeenCalledWith(
                spyMethod,
                spyProperties
            );
        });
    });

    describe('#registerSpyMethod', () => {
        let set: any;

        beforeEach(() => {
            set = jest.fn().mockName('set');
            instance.spyPropertiesMap = {
                set,
            };
        });

        it('should register passed spy with its properties', () => {
            instance.registerSpyMethod(spyMethod, spyProperties);
            expect(set).toHaveBeenCalledWith(spyMethod, spyProperties);
        });
    });

    describe('spy methods', () => {
        beforeEach(() => {
            spyProperties = {};
            instance.getSpyProperties = jest
                .fn()
                .mockName('getSpyProperties')
                .mockReturnValue(spyProperties);
        });

        describe('#perfromSpyCall', () => {
            let handler: any;

            beforeEach(() => {
                handler = jest
                    .fn()
                    .mockName('handler')
                    .mockReturnValue(spyResult);

                spyProperties.handler = handler;
                spyProperties.countOfCalls = 0;
                spyProperties.args = [args];
            });

            it('should increment count of spy calls and set its called status to true', () => {
                instance.perfromSpyCall(spyMethod, args);

                expect(instance.getSpyProperties).toHaveBeenCalledWith(
                    spyMethod
                );
                expect(spyProperties.countOfCalls).toBe(1);
                expect(spyProperties.isCalled).toBeTruthy();
                expect(handler).toHaveBeenCalledWith(...args);
            });

            it('should store arguments with which spy was called', () => {
                instance.perfromSpyCall(spyMethod, args);
                expect(spyProperties.args).toEqual([args, args]);
            });

            it('should  return result of spy handler function', () => {
                expect(instance.perfromSpyCall(spyMethod, args)).toBe(
                    spyResult
                );
            });
        });

        describe('#getCallFake', () => {
            const handler = 'handler';

            it('should set passed callback to spy properties handler and return spyMethod to support chaining', () => {
                expect(instance.getCallFake(spyMethod)(handler)).toBe(
                    spyMethod
                );
                expect(spyProperties.handler).toBe(handler);
                expect(instance.getSpyProperties).toHaveBeenCalledWith(
                    spyMethod
                );
            });
        });

        describe('#getCallOrigin', () => {
            const origin = 'origin';

            it('should set origin to handler method and return spy method', () => {
                spyProperties.origin = origin;
                expect(instance.getCallOrigin(spyMethod)()).toBe(spyMethod);
                expect(spyProperties.handler).toBe(origin);
                expect(instance.getSpyProperties).toHaveBeenCalledWith(
                    spyMethod
                );
            });
        });

        describe('#getReturnValue', () => {
            const returnValue = 'returnValue';

            it('should set handler method which returns passed return value and return spyMethod to support chaining', () => {
                expect(instance.getReturnValue(spyMethod)(returnValue)).toBe(
                    spyMethod
                );
                expect(spyProperties.handler()).toBe(returnValue);
                expect(instance.getSpyProperties).toHaveBeenCalledWith(
                    spyMethod
                );
            });
        });
    });

    describe('#setOrigin', () => {
        let spyProperties: any;
        let context: any;

        const methodName = 'methodName';
        const origin = (): any => ({});

        beforeEach(() => {
            context = { [methodName]: origin };
            spyProperties = {};
            instance.getSpyProperties = jest
                .fn()
                .mockName('getSpyProperties')
                .mockReturnValue(spyProperties);
        });

        it('should set origin method to origin spy porperties', () => {
            instance.setOrigin(spyMethod, context, methodName);
            expect(instance.getSpyProperties).toHaveBeenCalledWith(spyMethod);
            expect(spyProperties.origin).toBe(origin);
        });
    });

    describe('#getSpyProperties', () => {
        let get: any;

        beforeEach(() => {
            get = jest.fn().mockName('get').mockReturnValue(spyProperties);

            instance.spyPropertiesMap = {
                get,
            };
        });

        it('should return spy properties for passed spy method', () => {
            expect(instance.getSpyProperties(spyMethod)).toBe(spyProperties);
            expect(get).toHaveBeenCalledWith(spyMethod);
        });
    });
});
