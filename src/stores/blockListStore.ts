import {makeAutoObservable} from 'mobx';

export interface IBlock {
    id?: number;
    name?: string;
    boardId: number;
}

class blockListStore {
    blockList: Array<IBlock> = [];
    constructor() {
        makeAutoObservable(this);
    }

    addBlock = (block: IBlock) => {
        block.id = this.blockList.length;
        this.blockList.push(block);
        return block.id;
    }

    removeAllBlock = () => {
        if (this.blockList.length > 0) {
            this.blockList = [];
        }
    }
}

export default new blockListStore();
