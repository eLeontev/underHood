export type Callback = () => void;
export type CallbackList = Array<Callback>;

export interface Matchers {
    toBeTruthy(): boolean;
}

export type DescribeModel = (description: string, callback: Callback) => void;
export interface DescribeCore {
    describe: DescribeModel;
}

export type BeforeAfterEachModel = (callback: Callback) => void;
export type ItModel = (description: string, callback: Callback) => void;
export interface InnerDescribeMethodsCore {
    beforeEach: BeforeAfterEachModel;
    afterEach: BeforeAfterEachModel;
    it: ItModel;
}

export type JasmineCore = DescribeCore & InnerDescribeMethodsCore;
// it(description: string, callback: Callback);
// expect<EntityToValidate>(entityToValidate: EntityToValidate): Matchers;
