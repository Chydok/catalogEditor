import {makeAutoObservable} from 'mobx';
export interface ItreeBlockStore {
    id: number;
    name?: string;
    order?: number;
}

export class treeBlockStore implements ItreeBlockStore {
    id = 0;
    text = '';
    order = 0;

    constructor() {
        makeAutoObservable(this);
    }
}
