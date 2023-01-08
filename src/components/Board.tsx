import React from 'react';
import {observer} from "mobx-react";

import Block from "./Block";
import boardStore, {IBoard} from "../stores/boardListStore";
import blockListStore, {IBlock} from "../stores/blockListStore";

const blockList = blockListStore.blockList;
function Board(props: IBoard) {
    function dragLeaveHandler (e: React.DragEvent<HTMLDivElement>) {
        e.currentTarget.style.background = 'white';
    }
    function dragEnterHandler(e: React.DragEvent<HTMLDivElement>) {
        e.currentTarget.style.background = 'lightgray';
    }

    function dragOverHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
    }

    function dropHandler(e: React.DragEvent<HTMLDivElement>, treeBlockId: number, board: IBoard) {
        const currentBlockOrder = Number(e.dataTransfer.getData("currentBlockIndex"));
        const currentBlockId = Number(e.dataTransfer.getData("currentBlockId"));
        const newIndex = treeBlockId !== -1 ? board?.blockIdList.indexOf(treeBlockId) : props.blockIdList.length;
        if (typeof newIndex !== "undefined" && newIndex !== currentBlockOrder) {
            boardStore.sortBlock(newIndex, currentBlockOrder, board.id, currentBlockId);
            e.currentTarget.style.background = 'white';
        }
    }

    const endDiv = <div
        data-key={(props.blockIdList.length > 0 ? props.blockIdList.length + 1 : 0)}
        onDrop={(e) => dropHandler(e, (props.blockIdList.length > 0 ? -1 : 0), props)}
        onDragLeave={(e) => dragLeaveHandler(e)}
        onDragEnter={(e) => dragEnterHandler(e)}
        onDragOver={(e) => dragOverHandler(e)}
        className="dropBox"/>

    return (
        <div key={props.id} className="board">
            <button
                className="addBlockButton"
                onClick={() => {
                    const newBlockId = blockListStore.addBlock({
                        name: 'Test',
                        boardId: props.id
                    });
                    boardStore.addBlockInBoard(props, newBlockId);
                }}
            >+</button>
            {props.blockIdList.map((treeBlockId, key) => {
                const block: IBlock | undefined = blockList.find(element => element.id === treeBlockId);
                return (block ?
                    <div key={treeBlockId}>
                        <div
                            onDrop={(e) => dropHandler(e, treeBlockId, props)}
                            onDragLeave={(e) => dragLeaveHandler(e)}
                            onDragEnter={(e) => dragEnterHandler(e)}
                            onDragOver={(e) => dragOverHandler(e)}
                            className="dropBox"/>
                        <Block
                            key={key}
                            id={block.id}
                            name={block.name}
                            boardId={block.boardId}/></div>
                 : <div/>);
            })}
            {endDiv}
        </div>
    );
}

export default observer(Board);
