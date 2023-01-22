import {makeAutoObservable} from 'mobx';

export interface IBlockStructure {
    nameEn: string;
    nameRu: string;
    type: string;
}

export interface IBoardLine {
    id: number;
    name?: string;
    boardStructure?: Array<IBlockStructure>;
    lastLine?: boolean;
    logicLine?: boolean;
}

class boardLineStore {
    boardLineList: Array<IBoardLine> = [];

    constructor() {
        makeAutoObservable(this);
    }

    addBlockLine = (boardLine: IBoardLine) => {
        boardLine.name = boardLine.name ? boardLine.name : '';
        boardLine.lastLine = boardLine.lastLine ? boardLine.lastLine : false;
        boardLine.logicLine = boardLine.logicLine ? boardLine.logicLine : false;
        this.boardLineList.push(boardLine);
    }

    updateBlockLine = (boardLine: IBoardLine) => {
        const findBoardLine = this.boardLineList.find(item => item.id === boardLine.id);
        if (findBoardLine) {
            findBoardLine.name = boardLine.name;
            findBoardLine.lastLine = boardLine.lastLine;
            findBoardLine.logicLine = boardLine.logicLine;
            findBoardLine.boardStructure = boardLine.boardStructure;
        }
    }

    removeAllLines = () => {
        this.boardLineList = [];
    }
}

export default new boardLineStore();