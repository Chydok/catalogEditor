import {makeAutoObservable} from 'mobx';

export interface ItreeBlockStore {
    id?: number;
    name?: string;
    order?: number;
    parentBlockId?: number;
    boardIndex?: number;
    childBlockList?: Array<ItreeBlockStore>;
}

class treeBlockListStore {
    treeBlockList: Array<ItreeBlockStore> = [];
    constructor() {
        makeAutoObservable(this);
    }

    addTreeBlock = (treeBlock: ItreeBlockStore) => {
        treeBlock.id = this.treeBlockList.length + 1;
        treeBlock.order = this.treeBlockList.length + 1;
        this.treeBlockList.push(treeBlock);
    }

    removeAllTreeBlock = () => {
        if (this.treeBlockList.length > 0) {
            this.treeBlockList = [];
        }
    }

    moveTreeBlock = (newIndex: number, oldIndex: number) => {
        newIndex = oldIndex < newIndex ? newIndex - 2 : newIndex - 1;
        const treeBlock: ItreeBlockStore = this.treeBlockList[oldIndex - 1];
        this.treeBlockList.splice(oldIndex - 1,1);
        if (treeBlock) {
            this.treeBlockList.splice(newIndex, 0, treeBlock);
        }
        let count = 0;
        this.treeBlockList.map((block) => {
            count++;
            block.id = count;
            return block;
        });
    }
}

export default new treeBlockListStore();
