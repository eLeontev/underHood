import { Validator } from './models/matchers.model';
import { TestCase, Context } from './models/describe.model';
import { Callback } from './models/jasmine.model';
import {
    TestsResults,
    TestCaseResult,
    TestCaseResults,
} from './models/runner.model';
import { Store } from './models/store.model';
import { asyncReduce, asyncMap } from './async-utils';

export class Runner {
    constructor(private store: Store) {}

    public run = async (): Promise<TestsResults> => {
        return await this.performDecribers(this.store.rootDescribersId, []);
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

        await it.callback.call(context);

        return {
            itDescription: it.description,
            validatorResults: testCase.validators.map(
                ({ validatorResult }: Validator) => validatorResult
            ),
        };
    }

    private setActiveDescriberId(describerId: string): void {
        this.store.activeDescriberId = describerId;
    }

    private setActiveTestCaseIndex(index: number): void {
        this.store.activeTestCaseIndex = index;
    }
}
