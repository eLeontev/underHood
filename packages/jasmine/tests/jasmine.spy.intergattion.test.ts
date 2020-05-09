/* eslint-disable @typescript-eslint/no-explicit-any */

import { Jasmine } from '../jasmine';
import { Spy } from '../spy';
import { ValidatorResult } from '../models/matchers.model';

const inst = new Jasmine();
const { createSpy } = new Spy();

const fn = (): any => true;
const args = [1, 2, 3, {}, fn];

let callableSpy: any;
let uncallableSpy: any;

inst.describe('test', () => {
    inst.it('spy integration tests', () => {
        callableSpy = createSpy('callableSpy');
        uncallableSpy = createSpy('uncallableSpy');

        callableSpy();
        callableSpy(fn);
        callableSpy(...args);

        inst.expect(callableSpy).toHaveBeenCalled();
        inst.expect(callableSpy).toHaveBeenCalledWith(fn);
        inst.expect(callableSpy).toHaveBeenCalledWith(...args);
        inst.expect(uncallableSpy).toHaveBeenCalled();
        inst.expect(uncallableSpy).not.toHaveBeenCalled();
        inst.expect(undefined).toHaveBeenCalled();
        inst.expect(false).toHaveBeenCalledWith(...args);
    });
});
const result = inst.run();

const getValidatorResultByIndex = async (
    index: number
): Promise<ValidatorResult> => {
    const {
        testsResults: [testResults],
    } = await result;
    const [{ validatorResults }] = testResults.testCaseResults;
    return validatorResults[index];
};

describe('spy integration tests', () => {
    it('should return valid value with callable spy', async () => {
        // inst.expect(callableSpy).toHaveBeenCalled();
        expect(await getValidatorResultByIndex(0)).toEqual({
            errorMessage: '',
            isSuccess: true,
        });

        // inst.expect(callableSpy).toHaveBeenCalledWith(fn);
        expect(await getValidatorResultByIndex(1)).toEqual({
            errorMessage: '',
            isSuccess: true,
        });

        // inst.expect(callableSpy).toHaveBeenCalledWith(...args);
        expect(await getValidatorResultByIndex(2)).toEqual({
            errorMessage: '',
            isSuccess: true,
        });

        // inst.expect(uncallableSpy).toHaveBeenCalled();
        expect(await getValidatorResultByIndex(3)).toEqual({
            errorMessage: 'expected spy uncallableSpy to have been called',
            isSuccess: false,
        });

        // inst.expect(uncallableSpy).not.toHaveBeenCalled();
        expect(await getValidatorResultByIndex(4)).toEqual({
            errorMessage: '',
            isSuccess: true,
        });

        // inst.expect(undefined).toHaveBeenCalled();
        expect(await getValidatorResultByIndex(5)).toEqual({
            errorMessage: 'expected spy but got undefined',
            isSuccess: false,
        });

        // inst.expect(false).toHaveBeenCalledWith(...args);
        expect(await getValidatorResultByIndex(6)).toEqual({
            errorMessage: 'expected spy but got false',
            isSuccess: false,
        });
    });
});
