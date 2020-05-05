/* eslint-disable @typescript-eslint/no-explicit-any */
import { SpyAPICore } from './models/spy-api.model';

export class SpyAPI<SpyResult> implements SpyAPICore {
    constructor(private spyResult: SpyResult) {}

    public getSpyResult(): SpyResult {
        return this.spyResult;
    }
}
