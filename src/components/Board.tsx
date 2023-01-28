import React, {FC, useState} from 'react';
import {observer} from "mobx-react";

import Block from "./Block";
import boardStore, {IBoard} from "../stores/boardListStore";
import blockListStore, {IBlock} from "../stores/blockListStore";
import boardLineStore from "../stores/boardLineStore";

const blockList = blockListStore.blockList;
interface IBoardComponent extends IBoard {
    selectedBlockList: Array<number>;
    selectedBoardId: number|undefined;
    addSelectedBlockList: (blockId: number) => void;
    removeSelectedBlockId: (blockId: number) => void;
    updateSelectedBoardId: (boardId: number) => void;
    setCurrentBoardLine:(boardLineId: number) => void;
    setModalFormActive:(active: boolean) => void;
}
const Board: FC<IBoardComponent> = (props: IBoardComponent) => {
    const [classBoardName, setClassBoardName] = useState<string>('board');
    const boardLine = boardLineStore.boardLineList.find(item => item.id === props.boardLine);
    function dragLeaveHandler (e: React.DragEvent<HTMLDivElement>) {
        e.currentTarget.style.background = 'white';
    }
    function dragEnterHandler(e: React.DragEvent<HTMLDivElement>) {
        e.currentTarget.style.background = 'lightgray';
    }

    function dragOverHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
    }

    function dropHandler(e: React.DragEvent<HTMLDivElement>, blockId: number, board: IBoard) {
        const newIndex = blockId !== -1 ? board?.blockIdList.indexOf(blockId) : props.blockIdList.length;
        for (let currentBlockId of props.selectedBlockList) {
            if (typeof newIndex !== "undefined" && blockId !== currentBlockId) {
                boardStore.sortBlock(newIndex, currentBlockId, board.id);
                e.currentTarget.style.background = 'white';
            }
        }
        for (let currentBlockId of props.selectedBlockList) {
            props.removeSelectedBlockId(currentBlockId);
        }
    }

    const changeSize = () => {
        setClassBoardName(classBoardName === 'board' ? 'board boardEdit': 'board');
    }

    const endDiv = <div
        data-key={(props.blockIdList.length > 0 ? props.blockIdList.length + 1 : 0)}
        onDrop={(e) => dropHandler(e, (props.blockIdList.length > 0 ? -1 : 0), props)}
        onDragLeave={(e) => dragLeaveHandler(e)}
        onDragEnter={(e) => dragEnterHandler(e)}
        onDragOver={(e) => dragOverHandler(e)}
        className="dropBox"/>

    const pencilIcon = require("../icons/pencil.png");
    return (
        <div key={props.id} className={classBoardName}>
            <div className="boardLineHeader">
                <button
                    className="addBlockButton"
                    onClick={() => {
                        const newBlockId = blockListStore.addBlock({
                            name: 'Test',
                            boardId: props.id,
                            logic: false
                        });
                        boardStore.addBlockInBoard(props, newBlockId);
                    }}
                >+
                </button>
                <div>{boardLine ? boardLine.name : ''}</div>
                <button className="editBlockButton"
                        onClick={() => {
                            props.setCurrentBoardLine(props.boardLine);
                            props.setModalFormActive(true);
                        }}>
                    <img src={pencilIcon} className="pencilIcon" alt={"edit"}/>
                </button>
            </div>
            {props.blockIdList.map((blockId, key) => {
                const block: IBlock | undefined = blockList.find(element => element.id === blockId);
                return (typeof block !== "undefined" && block.del !== true ?
                    <div key={blockId}>
                        <div
                            onDrop={(e) => dropHandler(e, blockId, props)}
                            onDragLeave={(e) => dragLeaveHandler(e)}
                            onDragEnter={(e) => dragEnterHandler(e)}
                            onDragOver={(e) => dragOverHandler(e)}
                            className="dropBox"/>
                        <Block
                            key={key}
                            className="block"
                            id={block.id}
                            name={block.name}
                            boardId={block.boardId}
                            logic={block.logic}
                            logicList={block.logicList}
                            selectedBlockList={props.selectedBlockList}
                            selectedBoardId={props.selectedBoardId}
                            blockFormEdit={boardLine?.boardStructure || []}
                            boardLine={props.boardLine}
                            changeBoardSize={() => changeSize()}
                            addSelectedBlockList={props.addSelectedBlockList}
                            removeSelectedBlockId={props.removeSelectedBlockId}
                            updateSelectedBoardId={props.updateSelectedBoardId}
                        />
                    </div>
                    : <div/>);
            })}
            {endDiv}
        </div>
    );
}

export default observer(Board);
