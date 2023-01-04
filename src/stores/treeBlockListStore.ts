import {makeAutoObservable} from 'mobx';
export interface ItreeBlockStore {
    id: number;
    name?: string;
    order?: number;
}

class treeBlockListStore {
    // @ts-ignore
    treeBlockList: Array<ItreeBlockStore> = [];
    constructor() {
        makeAutoObservable(this);
    }

    addTreeBlock = (treeBlock: ItreeBlockStore) => {
        this.treeBlockList.push(treeBlock);
    }

    removeAllTreeBlock = () => {
        if (this.treeBlockList.length > 0) {
            this.treeBlockList = [];
        }
    }

    moveTreeBlock = (newIndex: number, oldIndex: number, treeBlock: ItreeBlockStore | undefined) => {
        this.treeBlockList.splice(oldIndex,1);
        if (treeBlock) {
            this.treeBlockList.splice(newIndex - 1, 0, treeBlock);
        }
        let count = 0;
        this.treeBlockList.map((block) => {
            count++;
            block.order = count;
        });
    }
}

export default new treeBlockListStore();
