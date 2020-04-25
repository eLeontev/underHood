export type Callback = () => void;
export type CallbackList = Array<Callback>;

export interface Matchers {
    toBeTruthy(): boolean;
}

export type DescribeModel = (
    description: string,
    callback: Callback,
    parentDescriberId?: string
) => void;
export interface DescribeCore {
    describe: DescribeModel;
}

export type JasmineCore = DescribeCore;
// it(description: string, callback: Callback);
// beforeEach(description: string, callback: Callback);
// expect<EntityToValidate>(entityToValidate: EntityToValidate): Matchers;
