import {makeAutoObservable} from 'mobx';
import {ReactElement} from "react";

import blockListStore, {IBlock} from "./blockListStore";

export interface IBoard {
    children?: Array<ReactElement>;
    id: number;
    parentBlock?: number;
    blockIdList: Array<number>;
    viewBoard: boolean;
    boardLine: number,
}
class boardListStore {
    boardList: Array<IBoard> = [];
    constructor() {
        makeAutoObservable(this);
    }

    addBoard = (boardList: Array<IBoard>) => {
        for (let board of boardList) {
            this.boardList.push(board);
        }
    }

    addBlockInBoard = (currentBoard: IBoard, blockId: number) => {
        for (let board of this.boardList) {
            if (board.id === currentBoard.id) {
                board.blockIdList.push(blockId);
                break;
            }
        }
    }

    moveAllBlocks(fromBlock: IBlock, toBlock: IBlock, board: IBoard) {
        const currentBoards: {from?: IBoard, to?: IBoard} = {
            from: this.boardList.find(((elem) => elem.parentBlock === fromBlock.id)),
            to: this.boardList.find(((elem) => elem.parentBlock === toBlock.id))
        };
        if (!currentBoards.from) {
            this.addBoard([{
                id: this.boardList.length + 1,
                blockIdList: [],
                parentBlock: fromBlock?.id,
                viewBoard: true,
                boardLine: board.boardLine + 1
            }]);
            currentBoards.from = this.boardList.find(((elem) => elem.parentBlock === fromBlock.id));
        }
        if (currentBoards.from && !currentBoards.to) {
            this.addBoard([{
                id: this.boardList.length + 1,
                blockIdList: [],
                parentBlock: toBlock?.id,
                viewBoard: true,
                boardLine: board.boardLine + 1
            }]);
            currentBoards.to = this.boardList.find(((elem) => elem.parentBlock === toBlock.id));
        }
        if (currentBoards.from && currentBoards.to) {
            currentBoards.to.blockIdList = currentBoards.to.blockIdList.concat(currentBoards.from.blockIdList);
            for (let boardId of currentBoards.to.blockIdList) {
                let blockEdit = blockListStore.blockList.find((elem) => elem.id === boardId);
                blockEdit!.boardId = currentBoards.to.id;
            }
            this.viewBoard(toBlock);
            const delIndexBoard = this.boardList.findIndex((elem) => elem.id === currentBoards.from!.id);
            this.boardList.splice(delIndexBoard, 1);
            if (typeof fromBlock.id !== "undefined") {
                const boardOldBlock = this.boardList.find((elem) => elem.id === fromBlock.boardId);
                if (boardOldBlock) {
                    let delIndex = boardOldBlock.blockIdList.indexOf(fromBlock.id);
                    boardOldBlock.blockIdList.splice(delIndex, 1);
                }
            }
        }
    }

    moveBottomBlockInAnotherAbove (bottomBlock: IBlock, aboveBlock: IBlock) {
        const currentBoards: {bottom?: IBoard, above?: IBoard} = {
            bottom: this.boardList.find(((elem) => elem.id === bottomBlock.boardId)),
            above: this.boardList.find(((elem) => elem.parentBlock === aboveBlock.id))
        };
        if (bottomBlock.id != null) {
            const delIndex: number | undefined = currentBoards.bottom?.blockIdList.indexOf(bottomBlock.id);
            if (delIndex && delIndex !== -1) {
                currentBoards.bottom?.blockIdList.splice(delIndex, 1);
                currentBoards.above?.blockIdList.push(bottomBlock.id);
                bottomBlock.boardId = Number(currentBoards.above?.id);
                this.viewBoard(aboveBlock);
            }
        }
    }

    viewBoard = (block: IBlock | undefined) => {
        const board = this.boardList.find(elem => elem.parentBlock === block?.id);
        const currentBoard = this.boardList.find(elem => elem.id === block?.boardId);
        if (currentBoard) {
            for (let item of this.boardList) {
                if (item.boardLine > currentBoard.boardLine) {
                    item.viewBoard = false;
                }
            }
            if (board) {
                board.viewBoard = true;
            } else {
                this.addBoard([{
                    id: this.boardList.length + 1,
                    blockIdList: [],
                    parentBlock: block?.id,
                    viewBoard: true,
                    boardLine: currentBoard.boardLine + 1
                }]);
            }
        }
    }

    removeAllBoards = () => {
        if (this.boardList.length > 0) {
            this.boardList = []
        }
    }

    sortBlock = (newIndex: number, currentBlockId: number, selectBoardId: number) => {
        const selectBoard = this.boardList.find((element) => element.id === selectBoardId);
        const currentBlock = blockListStore.blockList.find((element) => element.id === currentBlockId);
        if (selectBoard && currentBlock) {
            if (selectBoard.id === currentBlock.boardId) {
                const oldIndex = selectBoard.blockIdList.indexOf(currentBlockId);
                newIndex = oldIndex < newIndex ? newIndex - 1 : newIndex;
                if (oldIndex !== newIndex) {
                    const treeBlock: number[] = selectBoard.blockIdList.splice(oldIndex, 1);
                    selectBoard.blockIdList.splice(newIndex, 0, treeBlock[0]);
                }
            } else {
                const oldBoard = this.boardList.find((element) => element.id === currentBlock.boardId);
                if (oldBoard && oldBoard.boardLine === selectBoard.boardLine) {
                    const oldIndex = oldBoard.blockIdList.indexOf(currentBlockId);
                    const block: number[] = oldBoard.blockIdList.splice(oldIndex, 1);
                    currentBlock.boardId = selectBoard.id;
                    selectBoard.blockIdList.splice(newIndex, 0, block[0]);
                }
            }
        }
    }
}

export default new boardListStore();