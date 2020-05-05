/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any */

import { Describe } from '../describe';
import { store } from '../store';

describe('Describe', () => {
    let instance: any;
    let callback: any;
    let describer: any;

    const description = 'description';
    const describerId = 'describerId';
    const activeDescriberId = 'activeDescriberId';
    const parentMethods = 'parentMethods';

    beforeEach(() => {
        instance = new Describe({ ...store });
    });

    beforeEach(() => {
        callback = jest.fn();
        describer = 'describer';
    });

    describe('#describe', () => {
        beforeEach(() => {
            instance.describeHandler = jest.fn().mockName('describeHandler');
            instance.getEmptyParentMethods = jest
                .fn()
                .mockName('getEmptyParentMethods')
                .mockReturnValue(parentMethods);
        });

        it('should call #describeHandler with passed description and calback', () => {
            instance.describe(description, callback);
            expect(instance.describeHandler).toHaveBeenCalledWith({
                description,
                callback,
                parentMethods,
            });
            expect(instance.getEmptyParentMethods).toHaveBeenCalled();
        });
    });

    describe('#childDescribe', () => {
        const describerArguments: any = 'describerArguments';

        beforeEach(() => {
            instance.describeHandler = jest.fn();
        });

        it('should call #describeHandler with passed describer arguments and describerId', () => {
            instance.childDescribe(describerArguments, describerId);
            expect(instance.describeHandler).toHaveBeenCalledWith(
                describerArguments,
                describerId
            );
        });
    });

    describe('#describeHandler', () => {
        const isDescriberFormingInProgress = 'isDescriberFormingInProgress';
        let describerArguments: any;

        beforeEach(() => {
            describerArguments = {
                description,
                callback,
            };

            instance.store.nextDescriberArguments = [
                isDescriberFormingInProgress,
            ];
            instance.store.isDescriberFormingInProgress = false;
            instance.initDescribe = jest.fn();

            instance.performChildrenDescribers = jest
                .fn()
                .mockName('performChildrenDescribers');
            instance.beforeCallbackCall = jest
                .fn()
                .mockName('beforeCallbackCall');
            instance.afterCallbackCall = jest
                .fn()
                .mockName('afterCallbackCall');
            instance.getEmptyParentMethods = jest
                .fn()
                .mockName('getEmptyParentMethods')
                .mockReturnValue(parentMethods);
        });

        it('should store passed description and callback if previous description forming not completed yet', () => {
            instance.store.isDescriberFormingInProgress = true;
            instance.describeHandler(describerArguments);
            expect(instance.initDescribe).not.toHaveBeenCalled();
            expect(instance.store.nextDescriberArguments).toEqual([
                isDescriberFormingInProgress,
                {
                    description,
                    callback,
                    parentMethods,
                },
            ]);
            expect(instance.getEmptyParentMethods).toHaveBeenCalled();
        });

        it('should call before/after methods to hande callback with valid state', () => {
            instance.beforeCallbackCall.mockImplementation(() => {
                expect(callback).not.toHaveBeenCalled();
                expect(instance.afterCallbackCall).not.toHaveBeenCalled();
            });
            callback.mockImplementation(() => {
                expect(instance.afterCallbackCall).not.toHaveBeenCalled();
            });

            instance.describeHandler(describerArguments, describerId);

            expect(callback).toHaveBeenCalled();
            expect(instance.afterCallbackCall).toHaveBeenCalled();
            expect(instance.beforeCallbackCall).toHaveBeenLastCalledWith(
                describerArguments,
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
            expect(instance.store.activeDescriberId).toBe(activeDescriberId);
            expect(instance.store.isDescriberFormingInProgress).toBeTruthy();
        });
    });

    describe('#afterCallbackCall', () => {
        beforeEach(() => {
            instance.performChildrenDescribers = jest.fn();
            instance.store.activeDescriberId = activeDescriberId;
            instance.store.isDescriberFormingInProgress = true;
        });

        it('should clean up acitve describerId and mark forming describer completed', () => {
            instance.afterCallbackCall();
            expect(instance.store.activeDescriberId).toBeNull();
            expect(instance.store.isDescriberFormingInProgress).toBeFalsy();
        });

        it('should perfrom children describers with passed active describerId', () => {
            instance.afterCallbackCall();
            expect(instance.performChildrenDescribers).toHaveBeenCalledWith(
                activeDescriberId
            );
        });
    });

    describe('#initDescribe', () => {
        let describerArguments: any;

        const parentBfeMethods = 'parentBfeMethods';
        const parentAfeMethods = 'parentAfeMethods';

        beforeEach(() => {
            describerArguments = {
                description,
                parentMethods: {
                    beforeEachList: [parentBfeMethods],
                    afterEachList: [parentAfeMethods],
                },
            };
            instance.setFormedDescriber = jest.fn();
        });

        it('should set formed describer with with its id and definition desriber as child type if id is passed', () => {
            instance.initDescribe(describerArguments, describerId);
            expect(instance.setFormedDescriber).toHaveBeenCalledWith(
                {
                    description,
                    beforeEachList: [parentBfeMethods],
                    afterEachList: [parentAfeMethods],
                    testCases: [],
                    childrenDescribersId: [],
                    context: {},
                },
                describerId,
                false
            );
        });

        it('should set formed describer with with its id and definition desriber as root type if id is not passed', () => {
            instance.initDescribe(describerArguments);
            expect(instance.setFormedDescriber).toHaveBeenCalledWith(
                {
                    description,
                    beforeEachList: [parentBfeMethods],
                    afterEachList: [parentAfeMethods],
                    testCases: [],
                    childrenDescribersId: [],
                    context: {},
                },
                'root-1',
                true
            );
        });

        it('#1 should set formed describer with parent bfe/afe methods', () => {
            instance.initDescribe(describerArguments);
            const [[initDescriber]] = instance.setFormedDescriber.mock.calls;
            expect(initDescriber.beforeEachList).toEqual([parentBfeMethods]);
            expect(initDescriber.afterEachList).toEqual([parentAfeMethods]);
        });
    });

    describe('#performChildrenDescribers', () => {
        const parentDescriberId = 'parentDescriberId';

        beforeEach(() => {
            instance.store.nextDescriberArguments = [{ description, callback }];
            instance.childDescribe = jest.fn().mockName('childDescribe');
            instance.addChildDesriberId = jest
                .fn()
                .mockName('addChildDesriberId');
            instance.childDescribe = jest.fn().mockName('childDescribe');
            instance.getParentMethods = jest
                .fn()
                .mockName('getParentMethods')
                .mockReturnValue(parentMethods);
        });

        it('should clean up next describerArguments', () => {
            instance.performChildrenDescribers(parentDescriberId, describerId);
            expect(instance.store.nextDescriberArguments).toEqual([]);
        });

        it('should call #childDescribe for each children', () => {
            instance.performChildrenDescribers(parentDescriberId, describerId);
            expect(instance.childDescribe).toHaveBeenCalledWith(
                { description, callback, parentMethods },
                'child-4'
            );
        });

        it('should set child describerId for each children to parent describer before call of #childDescribe', () => {
            instance.addChildDesriberId.mockImplementation(() =>
                expect(instance.childDescribe).not.toHaveBeenCalled()
            );
            instance.performChildrenDescribers(parentDescriberId, describerId);
            expect(instance.addChildDesriberId).toHaveBeenCalledWith(
                parentDescriberId,
                'child-5'
            );
        });
    });

    describe('#setFormedDescriber', () => {
        it('should add describer to collection of existed based on its describerId', () => {
            instance.store.describers = { existedDescribers: true };
            instance.setFormedDescriber(describer, describerId, false);
            expect(instance.store.describers).toEqual({
                existedDescribers: true,
                [describerId]: describer,
            });
        });

        it('should add describer to collection of existed and to list of root desribers if describer is root with generated id', () => {
            const existedRootDescriberId = 'existedRootDescriberId';
            instance.store.rootDescribersId = [existedRootDescriberId];

            instance.setFormedDescriber(describer, describerId, true);

            expect(instance.store.rootDescribersId).toEqual([
                existedRootDescriberId,
                describerId,
            ]);
            expect(instance.store.describers).toEqual({
                [describerId]: describer,
            });
        });
    });

    describe('#addChildDesriberId', () => {
        let describer: any;
        const existedChildId = 'existedChildId';
        const childDescriberId = 'childDescriberId';

        beforeEach(() => {
            describer = { childrenDescribersId: [existedChildId] };
            instance.getDescriberById = jest
                .fn()
                .mockName('getDescriberById')
                .mockReturnValue(describer);
        });

        it('should add child describerId to list of existed children id', () => {
            instance.store.describers[describerId] = describer;

            instance.addChildDesriberId(describerId, childDescriberId);

            expect(describer.childrenDescribersId).toEqual([
                existedChildId,
                childDescriberId,
            ]);
            expect(instance.getDescriberById).toHaveBeenCalledWith(describerId);
        });
    });

    describe('#getParentMethods', () => {
        const listOfParentBfeMethods: any = 'listOfParentBfeMethods';
        const listOfParentAfeMethods: any = 'listOfParentAfeMethods';

        beforeEach(() => {
            describer = {
                afterEachList: [listOfParentBfeMethods],
                beforeEachList: [listOfParentAfeMethods],
            };
            instance.getDescriberById = jest
                .fn()
                .mockName('getDescriberById')
                .mockReturnValue(describer);
        });

        it('should return parent methods based on passed describer id', () => {
            expect(instance.getParentMethods(describerId)).toEqual({
                afterEachList: [listOfParentBfeMethods],
                beforeEachList: [listOfParentAfeMethods],
            });
            expect(instance.getDescriberById).toHaveBeenCalledWith(describerId);
        });
    });

    describe('#getEmptyParentMethods', () => {
        it('should return emty parent methods', () => {
            expect(instance.getEmptyParentMethods()).toEqual({
                afterEachList: [],
                beforeEachList: [],
            });
        });
    });

    describe('#getDescriberById', () => {
        it('should return describer from store based on passed describer id', () => {
            const describer: any = 'describer';
            instance.store.describers[describerId] = describer;
            expect(instance.getDescriberById(describerId)).toBe(describer);
        });
    });
});
