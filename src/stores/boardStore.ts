import {makeAutoObservable} from 'mobx';
import {ReactElement} from "react";
import {ItreeBlockStore} from "./treeBlockListStore";

export interface IBoardList {
    children?: Array<ReactElement>;
    id: number;
    parentTreeBlock?: number;
    blockIdList: Array<number>;
    viewBoard: boolean;
    boardLine: number,
}
class boardStore {
    boardList: Array<IBoardList> = [];
    constructor() {
        makeAutoObservable(this);
    }

    addBoard = (boardList: Array<IBoardList>) => {
        for (let board of boardList) {
            this.boardList.push(board);
        }
    }

    addBlockInBoard = (currentBoard: IBoardList, blockId: number) => {
        for (let board of this.boardList) {
            if (board.id === currentBoard.id) {
                board.blockIdList.push(blockId);
                break;
            }
        }
    }

    viewBoard = (block: ItreeBlockStore | undefined) => {
        const board = this.boardList.find(elem => elem.id === block?.boardId)
        if (board) {
            let find: number | undefined = -1;
            for (let item of this.boardList) {
                if (item.boardLine > board.boardLine && item.viewBoard) {
                    item.viewBoard = false;
                }
                if (block?.id === item.parentTreeBlock) {
                    find = item.parentTreeBlock;
                    item.viewBoard = true;
                }
            }
            if (board && find === -1) {
                this.addBoard([{
                    id: this.boardList.length + 1,
                    blockIdList: [],
                    parentTreeBlock: block?.id,
                    viewBoard: true,
                    boardLine: board.boardLine + 1
                }]);
            }
        }
    }

    moveTreeBlock = (newIndex: number, oldIndex: number, boardId: number) => {
        newIndex = oldIndex < newIndex ? newIndex - 1 : newIndex;
        const board = this.boardList.find((element) => element.id === boardId);
        if (board) {
            const treeBlock: number[] = board.blockIdList.splice(oldIndex, 1);
            board.blockIdList.splice(newIndex, 0, treeBlock[0]);
        }
    }
}

export default new boardStore();