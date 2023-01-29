import {makeAutoObservable} from 'mobx';
import boardListStore from "./boardListStore";

export interface IBlock {
    id?: number;
    boardId: number;
    logic: boolean;
    logicList?: Array<number>;
    del?: boolean;
    form?: Array<{nameEn: string; nameRu: string; type: string; value: string}>;
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
            this.addBlock({
                boardId: block.boardId,
                logic: true,
                logicList: [],
                form: [{nameEn: 'name', nameRu: 'Имя', type: 'text', value: 'Логический блок'}]
            })
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

    updateFormInfo = (blockId: number, addObj: {nameEn: string; nameRu: string; type: string; value: string}) => {
        const block = this.blockList.find(item => item.id === blockId);
        if (block) {
            const findField = block.form?.find(item => item.nameEn === addObj.nameEn);
            if (findField) {
                findField.value = addObj.value;
            } else {
                if (!block.form) {
                    block.form = [];
                }
                block.form?.push(addObj);
            }
        }
    }
}

export default new blockListStore();
