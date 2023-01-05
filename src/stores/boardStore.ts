import {makeAutoObservable} from 'mobx';
import {ReactElement} from "react";
import board from "../components/Board";
import {ItreeBlockStore} from "./treeBlockListStore";

export interface IBoardList {
    children?: Array<ReactElement>;
    id: number;
    parentTreeBlock?: number;
    blockIdList: Array<number>;
    viewBoard: boolean;
}
class boardStore {
    boardList: Array<IBoardList> = [];
    constructor() {
        makeAutoObservable(this);
    }

    addBoard = (blockIdList: Array<IBoardList>) => {
        this.boardList = blockIdList;
    }

    viewBoard = (block: ItreeBlockStore | undefined) => {
        this.boardList.map((boardStore => {
            if (boardStore.parentTreeBlock && block?.boardIndex && boardStore.parentTreeBlock > block?.boardIndex) {
                boardStore.viewBoard = false;
            }
            if (block?.id === boardStore.parentTreeBlock) {
                boardStore.viewBoard = true;
            }
        }))
    }
}

export default new boardStore();