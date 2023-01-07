import React from 'react';
import treeBlockListStore, {ItreeBlockStore} from "../stores/treeBlockListStore";
import {observer} from "mobx-react";
import BoardStore, {IBoardList} from "../stores/boardStore";
import TreeBlock from "./TreeBlock";
import boardStore from "../stores/boardStore";

const treeBlockList = treeBlockListStore.treeBlockList;
function Board(props: IBoardList) {
    function dragLeaveHandler (e: React.DragEvent<HTMLDivElement>) {
        e.currentTarget.style.background = 'white';
    }
    function dragEnterHandler(e: React.DragEvent<HTMLDivElement>) {
        e.currentTarget.style.background = 'lightgray';
    }

    function dropHandler(e: React.DragEvent<HTMLDivElement>, treeBlockId: number, board: IBoardList) {
        const currentBlockOrder = Number(e.dataTransfer.getData("currentBlockIndex"));
        const newIndex = board?.blockIdList.indexOf(treeBlockId) !== -1 ? board?.blockIdList.indexOf(treeBlockId) : treeBlockId;
        if (typeof newIndex !== "undefined" && newIndex !== currentBlockOrder) {
            boardStore.moveTreeBlock(newIndex, currentBlockOrder, board.id);
            e.currentTarget.style.background = 'white';
        }
    }

    const endDiv = <div
        onDrop={(e) => dropHandler(e, props.blockIdList.length > 0 ? props.blockIdList.length + 1 : 0, props)}
        onDragLeave={(e) => dragLeaveHandler(e)}
        onDragOver={(e) => dragEnterHandler(e)}
        className="dropBox"/>

    function dragOverHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
    }

    return (
        <div key={props.id} className="board">
            <button
                className="addTreeBlock"
                onClick={() => {
                    const newBlockId = treeBlockListStore.addTreeBlock({
                        name: 'Test',
                        boardId: props.id
                    });
                    BoardStore.addBlockInBoard(props, newBlockId);
                }}
            >+</button>
            {props.blockIdList.map((treeBlockId, key) => {
                const block: ItreeBlockStore | undefined = treeBlockList.find(element => element.id === treeBlockId);
                return (block ?
                    <div key={treeBlockId}>
                        <div
                            onDrop={(e) => dropHandler(e, treeBlockId, props)}
                            onDragLeave={(e) => dragLeaveHandler(e)}
                            onDragEnter={(e) => dragEnterHandler(e)}
                            onDragOver={(e) => dragOverHandler(e)}
                            className="dropBox"/>
                        <TreeBlock
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
