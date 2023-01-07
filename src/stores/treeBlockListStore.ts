import {makeAutoObservable} from 'mobx';

export interface ItreeBlockStore {
    id?: number;
    name?: string;
    boardId: number;
    childBlockList?: Array<ItreeBlockStore>;
}

class treeBlockListStore {
    treeBlockList: Array<ItreeBlockStore> = [];
    constructor() {
        makeAutoObservable(this);
    }

    addTreeBlock = (treeBlock: ItreeBlockStore) => {
        treeBlock.id = this.treeBlockList.length;
        this.treeBlockList.push(treeBlock);
        return treeBlock.id;
    }

    removeAllTreeBlock = () => {
        if (this.treeBlockList.length > 0) {
            this.treeBlockList = [];
        }
    }
}

export default new treeBlockListStore();
