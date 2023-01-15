import {makeAutoObservable} from 'mobx';
import boardListStore from "./boardListStore";

export interface IBlock {
    id?: number;
    name?: string;
    boardId: number;
    logic: boolean;
    logicList?: Array<number>;
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

    addInLogicBlock = (block: IBlock, addBlockIdList: Array<number>) => {
        const newLogicBlockId = !block.logic ?
            this.addBlock({name: 'Логический блок', boardId: block.boardId, logic: true, logicList: []})
            : block.id;
        const newLogicBlock = this.blockList.find((item) => item.id === newLogicBlockId);
        if (block.id != null && !block.logic && newLogicBlock) {
            newLogicBlock.logicList?.push(block.id);
            newLogicBlock.logicList = newLogicBlock.logicList?.concat(addBlockIdList);
        } else if (block.id != null && block.logic) {
            const editBLock = this.blockList.find((item) => item.id === block.id);
            if (editBLock) {
                editBLock.logicList = block.logicList?.concat(addBlockIdList);
            }
        }

        const removeListId = newLogicBlock ? newLogicBlock.logicList : block.logicList;
        const currentBoard = boardListStore.boardList.find(item => item.id === block.boardId);
        if (removeListId) {
            for (let blockId of removeListId) {
                let indexBlock = currentBoard?.blockIdList.indexOf(blockId);
                if (typeof indexBlock !== "undefined" && indexBlock !== -1) {
                    currentBoard?.blockIdList.splice(indexBlock, 1);
                }
            }
        }

        if (newLogicBlock?.id && !block.logic) {
            currentBoard?.blockIdList.push(newLogicBlock.id);
            return newLogicBlock.id;
        }
    }
}

export default new blockListStore();
