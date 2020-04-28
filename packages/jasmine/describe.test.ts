/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any */

import { Describe } from './describe';

describe('Describe', () => {
    let instance: any;
    let callback: any;
    let describer: any;

    const description = 'description';
    const describerId = 'describerId';
    const activeDescriberId = 'activeDescriberId';

    beforeEach(() => {
        instance = new Describe();
    });

    beforeEach(() => {
        callback = jest.fn();
        describer = 'describer';
    });

    describe('#describe', () => {
        beforeEach(() => {
            instance.describeHandler = jest.fn();
        });

        it('should call #describeHandler with passed description and calback', () => {
            instance.describe(description, callback);
            expect(instance.describeHandler).toHaveBeenCalledWith(
                description,
                callback
            );
        });
    });

    describe('#childDescribe', () => {
        beforeEach(() => {
            instance.describeHandler = jest.fn();
        });

        it('should call #describeHandler with passed description, calback and describerId', () => {
            instance.childDescribe(description, callback, describerId);
            expect(instance.describeHandler).toHaveBeenCalledWith(
                description,
                callback,
                describerId
            );
        });
    });

    describe('#describeHandler', () => {
        const isDescriberFormingInProgress = 'isDescriberFormingInProgress';

        beforeEach(() => {
            instance.nextDescriberArguments = [isDescriberFormingInProgress];
            instance.initDescribe = jest.fn();
            instance.isDescriberFormingInProgress = false;
            instance.performChildrenDescribers = jest.fn();
            instance.beforeCallbackCall = jest.fn();
            instance.afterCallbackCall = jest.fn();
        });

        it('should store passed description and callback if previous description forming not completed yet', () => {
            instance.isDescriberFormingInProgress = true;
            instance.describeHandler(description, callback);
            expect(instance.initDescribe).not.toHaveBeenCalled();
            expect(instance.nextDescriberArguments).toEqual([
                isDescriberFormingInProgress,
                { description, callback },
            ]);
        });

        it('should call before/after methods to hande callback with valid state', () => {
            instance.beforeCallbackCall.mockImplementation(() => {
                expect(callback).not.toHaveBeenCalled();
                expect(instance.afterCallbackCall).not.toHaveBeenCalled();
            });
            callback.mockImplementation(() => {
                expect(instance.afterCallbackCall).not.toHaveBeenCalled();
            });

            instance.describeHandler(description, callback, describerId);

            expect(callback).toHaveBeenCalled();
            expect(instance.afterCallbackCall).toHaveBeenCalled();
            expect(instance.beforeCallbackCall).toHaveBeenLastCalledWith(
                description,
                describerId
            );
        });
    });

    describe('#beforeCallbackCall', () => {
        beforeEach(() => {
            instance.initDescribe = jest
                .fn()
                .mockReturnValue(activeDescriberId);
        });

        it('should init describer and set its id as active describerId', () => {
            instance.beforeCallbackCall(description, describerId);
            expect(instance.activeDescriberId).toBe(activeDescriberId);
            expect(instance.isDescriberFormingInProgress).toBeTruthy();
        });
    });

    describe('#afterCallbackCall', () => {
        beforeEach(() => {
            instance.performChildrenDescribers = jest.fn();
            instance.activeDescriberId = activeDescriberId;
            instance.isDescriberFormingInProgress = true;
        });

        it('should clean up acitve describerId and mark forming describer completed', () => {
            instance.afterCallbackCall();
            expect(instance.activeDescriberId).toBeNull();
            expect(instance.isDescriberFormingInProgress).toBeFalsy();
        });

        it('should perfrom children describers with passed active describerId', () => {
            instance.afterCallbackCall();
            expect(instance.performChildrenDescribers).toHaveBeenCalledWith(
                activeDescriberId
            );
        });
    });

    describe('#initDescribe', () => {
        beforeEach(() => {
            instance.setFormedDescriber = jest.fn();
        });

        it('should set formed describer with with its id and definition desriber as child type if id is passed', () => {
            instance.initDescribe(description, describerId);
            expect(instance.setFormedDescriber).toHaveBeenCalledWith(
                {
                    description,
                    beforeEachList: [],
                    afterEachList: [],
                    testCases: [],
                    childrenDescribersId: [],
                    context: {},
                },
                describerId,
                false
            );
        });

        it('should set formed describer with with its id and definition desriber as root type if id is not passed', () => {
            instance.initDescribe(description);
            expect(instance.setFormedDescriber).toHaveBeenCalledWith(
                {
                    description,
                    beforeEachList: [],
                    afterEachList: [],
                    testCases: [],
                    childrenDescribersId: [],
                    context: {},
                },
                'root-1',
                true
            );
        });
    });

    describe('#performChildrenDescribers', () => {
        const parentDescriberId = 'parentDescriberId';

        beforeEach(() => {
            instance.nextDescriberArguments = [{ description, callback }];
            instance.childDescribe = jest.fn();
            instance.addChildDesriberId = jest.fn();
            instance.childDescribe = jest.fn();
        });

        it('should clean up next describerArguments', () => {
            instance.performChildrenDescribers(parentDescriberId, describerId);
            expect(instance.nextDescriberArguments).toEqual([]);
        });

        it('should call #childDescribe for each children', () => {
            instance.performChildrenDescribers(parentDescriberId, describerId);
            expect(instance.childDescribe).toHaveBeenCalledWith(
                description,
                callback,
                'child-3'
            );
        });

        it('should set child describerId for each children to parent describer before call of #childDescribe', () => {
            instance.addChildDesriberId.mockImplementation(() =>
                expect(instance.childDescribe).not.toHaveBeenCalled()
            );
            instance.performChildrenDescribers(parentDescriberId, describerId);
            expect(instance.addChildDesriberId).toHaveBeenCalledWith(
                parentDescriberId,
                'child-4'
            );
        });
    });

    describe('#setFormedDescriber', () => {
        it('should add describer to collection of existed based on its describerId', () => {
            instance.describers = { existedDescribers: true };
            instance.setFormedDescriber(describer, describerId, false);
            expect(instance.describers).toEqual({
                existedDescribers: true,
                [describerId]: describer,
            });
        });

        it('should add describer to collection of existed and to list of root desribers if describer is root with generated id', () => {
            const existedRootDescriberId = 'existedRootDescriberId';
            instance.rootDescribersId = [existedRootDescriberId];

            instance.setFormedDescriber(describer, describerId, true);

            expect(instance.rootDescribersId).toEqual([
                existedRootDescriberId,
                describerId,
            ]);
            expect(instance.describers).toEqual({
                [describerId]: describer,
            });
        });
    });

    describe('#addChildDesriberId', () => {
        it('should add child describerId to list of existed children id', () => {
            const existedChildId = 'existedChildId';
            const childDescriberId = 'childDescriberId';
            const describer = { childrenDescribersId: [existedChildId] };

            instance.describers[describerId] = describer;

            instance.addChildDesriberId(describerId, childDescriberId);

            expect(describer.childrenDescribersId).toEqual([
                existedChildId,
                childDescriberId,
            ]);
        });
    });

    describe('#getMethods', () => {
        it('should  return describe methods to assigne them to main entry', () => {
            expect(instance.getMethods()).toEqual({
                addChildDesriberId: instance.addChildDesriberId,
                setFormedDescriber: instance.setFormedDescriber,
                performChildrenDescribers: instance.performChildrenDescribers,
                initDescribe: instance.initDescribe,
                afterCallbackCall: instance.afterCallbackCall,
                beforeCallbackCall: instance.beforeCallbackCall,
                describeHandler: instance.describeHandler,
                childDescribe: instance.childDescribe,
                describe: instance.describe,
            });
        });
    });
});
