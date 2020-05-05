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
                ...args
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
            });

            it('should increment count of spy calls and set its called status to true', () => {
                instance.perfromSpyCall(spyMethod, ...args);

                expect(instance.getSpyProperties).toHaveBeenCalledWith(
                    spyMethod
                );
                expect(spyProperties.countOfCalls).toBe(1);
                expect(spyProperties.isCalled).toBeTruthy();
                expect(handler).toHaveBeenCalledWith(...args);
            });

            it('should  return spy API with result of spy handler', () => {
                expect(
                    instance.perfromSpyCall(spyMethod, ...args).getSpyResult()
                ).toBe(spyResult);
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