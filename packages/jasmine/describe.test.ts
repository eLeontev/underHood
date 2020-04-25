/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any */

import { Describe } from './describe';

describe('Describe', () => {
    let instance: any;
    let callback: any;
    let describer: any;

    const description = 'description';
    const describerId = 'describerId';

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

        it('should init describer with passed desription and undefined if descrriberId is not passed', () => {
            instance.describeHandler(description, callback);
            expect(instance.initDescribe).toHaveBeenCalledWith(
                description,
                undefined
            );
        });

        it('should init describer with passed desription and descrriberId if it is passed', () => {
            instance.describeHandler(description, callback, describerId);
            expect(instance.initDescribe).toHaveBeenCalledWith(
                description,
                describerId
            );
        });

        it('should call callback with specific isDescriberFormingInProgress flag to postpone call of children describers', () => {
            callback.mockImplementation(() =>
                expect(instance.isDescriberFormingInProgress).toBeTruthy()
            );
            instance.describeHandler(description, callback);
            expect(callback).toHaveBeenCalled();
        });

        it('should call #performChildrenDescribers with cleared specific isDescriberFormingInProgress to enable their calls', () => {
            instance.performChildrenDescribers.mockImplementation(() =>
                expect(instance.isDescriberFormingInProgress).toBeFalsy()
            );
            instance.describeHandler(description, callback);
            expect(instance.performChildrenDescribers).toHaveBeenCalled();
        });

        it('should call #performChildrenDescribers with formed parent describer and describerId if parent describer is not root', () => {
            instance.initDescribe.mockReturnValue(describerId);
            instance.describeHandler(description, callback);
            expect(instance.performChildrenDescribers).toHaveBeenCalledWith(
                describerId
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
                    itList: [],
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
                    itList: [],
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
});
