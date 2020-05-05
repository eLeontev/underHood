import { Describers, DescriberArguments } from './describe.model';

export interface Store {
    activeDescriberId: string;
    isDescriberFormingInProgress: boolean;
    describers: Describers;
    rootDescribersId: Array<string>;
    activeTestCaseIndex: number;
    nextDescriberArguments: Array<DescriberArguments>;
}
