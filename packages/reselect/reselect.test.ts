import { createSelector } from './reselect';
import { Selector } from './reselect.model';

describe('#createSelector', () => {
    let selector: Selector<string, string>;
    let preparator: jest.Mock<string, Array<string>>;
    let calculator: jest.Mock<string, Array<string>>;

    const state = 'state';
    const preparatorResult = 'preparatorResult';
    const result = 'result';

    beforeEach(() => {
        preparator = jest
            .fn()
            .mockName('preparator')
            .mockReturnValue(preparatorResult);
        calculator = jest.fn().mockName('calculator').mockReturnValue(result);
    });

    beforeEach(() => {
        selector = createSelector(preparator, calculator);
    });

    it('should return result of calculator callled with result of preparator', () => {
        expect(selector(state)).toBe(result);
        expect(preparator).toHaveBeenCalledWith(state);
        expect(calculator).toHaveBeenCalledWith(preparatorResult);
    });

    it('should return hash result if previous state was the same as actual', () => {
        expect(selector(state)).toBe(result);
        expect(selector(state)).toBe(result);
        expect(preparator).toHaveBeenCalledTimes(1);
        expect(calculator).toHaveBeenCalledTimes(1);
    });
});
