import { TestCase } from './describe.model';
import { ExpectedResult, Validator, MatchersCore } from './matcher.model';
import { ExpectCore } from './jasmine.model';

export interface InnerMethods extends ExpectCore {
    getRegisteredValidator(
        testCase: TestCase,
        expectedResult: ExpectedResult
    ): Validator;
    getMastchers(
        testCase: TestCase,
        expectedResult: ExpectedResult
    ): MatchersCore;
}
