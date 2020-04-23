import { Describe } from './describe';

describe('Describe', () => {
    let instance: any;

    const description = 'description';
    const describerId = 'describerId';
    const entryDescriberId = 'entryDescriberId';

    beforeEach(() => {
        instance = new Describe();
    });

    describe('#describe', () => {
        let callback: any;

        beforeEach(() => {
            instance.hasProcessedDesribe = jest.fn();
            instance.initDescribe = jest.fn();
            instance.completeDesribeForming = jest.fn();
            instance.performNextDescribe = jest.fn();

            callback = jest.fn();
        });

        it('should set params to next describe arguments if current describe is not completed to postpone it', () => {
            instance.hasProcessedDesribe.mockReturnValue(true);
            instance.describe(description, callback);

            expect(instance.nextDescriberArguments).toEqual([
                {
                    description,
                    callback,
                },
            ]);

            expect(instance.hasProcessedDesribe).toHaveBeenCalled();
            expect(callback).not.toHaveBeenCalled();
        });

        it('should init perform describe to set to it all required data', () => {
            instance.describe(description, callback);

            expect(instance.nextDescriberArguments).toEqual([]);

            expect(instance.hasProcessedDesribe).toHaveBeenCalled();
            expect(callback).toHaveBeenCalled();
            expect(instance.initDescribe).toHaveBeenCalled();
            expect(instance.completeDesribeForming).toHaveBeenCalled();
            expect(instance.performNextDescribe).toHaveBeenCalled();
        });
    });

    describe('#initDescribe', () => {
        beforeEach(() => {
            instance.describerId = describerId;
            instance.describers = { hasDesribers: true };
        });

        it('should add new initialized describer to map of existed', () => {
            instance.initDescribe(description);

            const { hasDesribers } = instance.describers;
            const describer = instance.describers[describerId];

            expect(hasDesribers).toBeTruthy();

            expect(describer).toEqual({
                description,
                beforeEachList: [],
                itList: [],
                childrenDescriberId: null,
                context: {},
            });
        });
    });

    describe('#hasProcessedDesribe', () => {
        beforeEach(() => {
            instance.describers = { [describerId]: {} };
            instance.describerId = describerId;
            instance.entryDescriberId = entryDescriberId;
        });

        it('should return true if instance describe is not root and parent describe still processed', () => {
            expect(instance.hasProcessedDesribe()).toBeTruthy();
        });

        it('should return false for root describe', () => {
            instance.describerId = entryDescriberId;
            instance.describers = { [entryDescriberId]: {} };
            expect(instance.hasProcessedDesribe()).toBeFalsy();
        });

        it('should return false for describe which parent alredy completed', () => {
            instance.describers[describerId].childrenDescriberId = describerId;
            expect(instance.hasProcessedDesribe()).toBeFalsy();
        });
    });

    describe('#completeDesribeForming', () => {
        beforeEach(() => {
            instance.describerId = entryDescriberId;
            instance.describers = { [entryDescriberId]: {} };
            instance.generateChildrenEntryDescriberId = jest
                .fn()
                .mockImplementation(() => (instance.describerId = describerId));
        });

        it('should generate new describerId', () => {
            instance.completeDesribeForming();
            expect(
                instance.generateChildrenEntryDescriberId
            ).toHaveBeenCalled();
        });

        it('should set new generated describerId to actual describe to complete its forming', () => {
            instance.completeDesribeForming();
            expect(
                instance.describers[entryDescriberId].childrenDescriberId
            ).toBe(describerId);
        });
    });

    describe('#performNextDescribe', () => {
        const callback = 'callback';
        let nextArguments: any;

        beforeEach(() => {
            nextArguments = { description, callback };
            instance.nextDescriberArguments = [nextArguments];
            instance.describe = jest.fn();
        });

        it('should  do nothing if list of next desribe argumetns is empty', () => {
            instance.nextDescriberArguments = [];
            expect(instance.performNextDescribe());
            expect(instance.describe).not.toHaveBeenCalled();
        });

        it('should filter nextArguments from list of arguments and call #describe with them', () => {
            expect(instance.performNextDescribe());
            expect(instance.describe).toHaveBeenCalledWith(
                description,
                callback
            );
            expect(instance.nextDescriberArguments).toEqual([]);
        });
    });

    describe('#generateChildrenEntryDescriberId', () => {
        it('should generate new describeId', () => {
            instance.generateChildrenEntryDescriberId();
            const { describerId } = instance;
            instance.generateChildrenEntryDescriberId();

            expect(describerId).not.toBe(instance.describerId);
        });
    });
});
