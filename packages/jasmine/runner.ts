import { Validator } from './matcher.model';
import { Describer, TestCase, Context } from './describe.model';
import { Callback } from './jasmine.model';
import { InnerMethods, TestsResults, TestCaseResult } from './runner.model';

export class Runner {
    private activeDescriberId: string;
    private activeTestCaseIndex: number;
    private rootDescribersId: Array<string> = [];
    private describers: Array<Describer> = [];

    public run(): TestsResults {
        return this.performDecribers(this.rootDescribersId, []);
    }

    private performDecribers(
        describersIds: Array<string>,
        testsResults: TestsResults
    ): TestsResults {
        return describersIds.reduce(
            this.performTestsAndReturnTheirResults.bind(this),
            testsResults
        );
    }

    private performTestsAndReturnTheirResults(
        testsResults: TestsResults,
        describerId: string
    ): TestsResults {
        const {
            testCases,
            beforeEachList,
            afterEachList,
            description,
            context,
            childrenDescribersId,
        } = this.describers[describerId];

        this.setActiveDescriberId(describerId);

        beforeEachList.forEach((cb: Callback): void => cb.call(context));

        const testCaseResults = testCases.map(
            this.performTestAndReturnItsResult.bind(this, context)
        );

        afterEachList.forEach((cb: Callback): void => cb.call(context));

        this.setActiveDescriberId(null);
        this.setActiveTestCaseIndex(null);

        return this.performDecribers(childrenDescribersId, [
            ...testsResults,
            { description, testCaseResults },
        ]);
    }

    private performTestAndReturnItsResult(
        context: Context,
        testCase: TestCase,
        index: number
    ): TestCaseResult {
        const { it } = testCase;
        this.setActiveTestCaseIndex(index);

        it.callback.call(context);

        return {
            itDescription: it.description,
            validatorResults: testCase.validators.map(
                ({ validatorResult }: Validator) => validatorResult
            ),
        };
    }

    private setActiveDescriberId(describerId: string): void {
        this.activeDescriberId = describerId;
    }

    private setActiveTestCaseIndex(index: number): void {
        this.activeTestCaseIndex = index;
    }

    public getMethods(): InnerMethods {
        return {
            setActiveTestCaseIndex: this.setActiveTestCaseIndex,
            setActiveDescriberId: this.setActiveDescriberId,
            performTestAndReturnItsResult: this.performTestAndReturnItsResult,
            performTestsAndReturnTheirResults: this
                .performTestsAndReturnTheirResults,
            performDecribers: this.performDecribers,
            run: this.run,
        };
    }
}
