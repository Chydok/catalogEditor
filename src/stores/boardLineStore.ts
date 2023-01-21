import {makeAutoObservable} from 'mobx';

export interface IBlockStructure {
    nameEn: string;
    nameRu: string;
    type: string;
}

export interface IBoardLine {
    id: number;
    name: string;
    boardStructure: Array<IBlockStructure>;
    lastLine?: boolean;
    logicLine?: boolean;
}

class boardLineStore {
    boardLineList: Array<IBoardLine> = [];

    constructor() {
        makeAutoObservable(this);
    }

    addBlockLine = (boardLine: IBoardLine) => {
        boardLine.lastLine = boardLine.lastLine ? boardLine.lastLine : false;
        boardLine.logicLine = boardLine.logicLine ? boardLine.logicLine : false;
        this.boardLineList.push(boardLine);
    }

    removeAllLines = () => {
        this.boardLineList = [];
    }
}

export default new boardLineStore();