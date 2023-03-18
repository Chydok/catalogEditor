import {makeAutoObservable} from 'mobx';

export interface IMnemoNode {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    active: boolean;
}

export interface IMnemoLine {
    id: string | number;
    source: IMnemoNode;
    target: IMnemoNode;
}

class mnemoNodeStore {
    nodeList: Array<IMnemoNode> = [];
    lineList: Array<IMnemoLine> = [];

    constructor() {
        makeAutoObservable(this);
    }

    addNode = (node: IMnemoNode) => {
        this.nodeList.push(node);
    }

    addLine = (line: { source: string; target: string; }) => {
        const id = this.lineList.length + 1;
        const source = this.nodeList.find(item => item.id === line.source);
        const target = this.nodeList.find(item => item.id === line.target);
        if (typeof source !== 'undefined' && typeof target !== 'undefined') {
            const addLine: IMnemoLine = {id: id, source: source, target: target}
            this.lineList.push(addLine);
        }
    }

    removeLine = (line: IMnemoLine) => {
        const lineIndex = this.lineList.findIndex(item => item.id === line.id);
        this.lineList.splice(lineIndex, 1);
    }

    changeCoords = (id: string, x: number, y: number) => {
        const target = this.nodeList.find(item => item.id === id);
        target!.x = x;
        target!.y = y;
    }

    setActive = (node: IMnemoNode) => {
        const target = this.nodeList.find(item => item.id === node.id);
        target!.active = !target!.active;
    }
}

export default new mnemoNodeStore();