import {
    asyncReduce,
    asyncMap,
    getPromseResolvedInAvailableTimeFrame,
    availableAsyncCallbackPerormanceDelay,
} from './async-utils';
import { errorMessages } from './error.messages';

import { Validator, ValidatorResult } from './models/matchers.model';
import { TestCase, Context } from './models/describe.model';
import { Callback } from './models/jasmine.model';
import {
    TestsResults,
    TestCaseResult,
    TestCaseResults,
    TestResultsWithDisabledMethods,
} from './models/runner.model';
import { Store } from './models/store.model';

export class Runner {
    constructor(private store: Store) {}

    public run = async (): Promise<TestResultsWithDisabledMethods> => {
        const { store } = this;
        const {
            rootDescribersId,
            fDescribersId,
            inactiveDescribers,
            inactiveTestCases,
        } = store;

        const describersId = fDescribersId.length
            ? fDescribersId
            : rootDescribersId;

        const testsResults = await this.performDecribers(describersId, []);

        return {
            testsResults,
            disabledMethods: {
                describers: [...inactiveDescribers],
                testCases: [...inactiveTestCases],
            },
        };
    };

    private async performDecribers(
        describersIds: Array<string>,
        testsResults: TestsResults
    ): Promise<TestsResults> {
        return await asyncReduce<string, TestsResults>(
            describersIds,
            this.performTestsAndReturnTheirResults.bind(this),
            testsResults
        );
    }

    private async performTestsAndReturnTheirResults(
        testsResults: TestsResults,
        describerId: string
    ): Promise<TestsResults> {
        const {
            testCases,
            beforeEachList,
            afterEachList,
            description,
            context,
            childrenDescribersId,
        } = this.store.describers[describerId];

        this.setActiveDescriberId(describerId);

        beforeEachList.forEach((cb: Callback): void => cb.call(context));

        const testCaseResults: TestCaseResults = await asyncMap<
            TestCase,
            TestCaseResult
        >(testCases, this.performTestAndReturnItsResult.bind(this, context));

        afterEachList.forEach((cb: Callback): void => cb.call(context));

        this.setActiveDescriberId(null);
        this.setActiveTestCaseIndex(null);

        return await this.performDecribers(childrenDescribersId, [
            ...testsResults,
            { description, testCaseResults },
        ]);
    }

    private async performTestAndReturnItsResult(
        context: Context,
        testCase: TestCase,
        index: number
    ): Promise<TestCaseResult> {
        const { it } = testCase;
        this.setActiveTestCaseIndex(index);

        this.initValidators(testCase);
        const errorValidatorResult = await this.asyncCallbackHanlder(
            it.callback,
            context
        );

        return {
            itDescription: it.description,
            validatorResults: errorValidatorResult
                ? [errorValidatorResult]
                : testCase.validators.map(
                      ({ validatorResult }: Validator) => validatorResult
                  ),
        };
    }

    private async asyncCallbackHanlder(
        callback: Callback,
        context: Context
    ): Promise<void | ValidatorResult> {
        const callbackPromise = Promise.resolve(callback.call(context)).then(
            () => null
        );
        const errorTestPerofomrancePromise = getPromseResolvedInAvailableTimeFrame(
            errorMessages.testTimeFrameDurationExeeded(
                false,
                availableAsyncCallbackPerormanceDelay,
                []
            ),
            availableAsyncCallbackPerormanceDelay
        );

        return Promise.race([callbackPromise, errorTestPerofomrancePromise]);
    }

    private initValidators(testCase: TestCase): void {
        testCase.validators = [];
    }

    private setActiveDescriberId(describerId: string): void {
        this.store.activeDescriberId = describerId;
    }

    private setActiveTestCaseIndex(index: number): void {
        this.store.activeTestCaseIndex = index;
    }
}
