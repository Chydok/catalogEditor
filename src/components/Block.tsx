import React from "react";
import {observer} from "mobx-react";

import treeBlockListStore, {IBlock} from "../stores/blockListStore";
import boardListStore from "../stores/boardListStore";

function Block (props: IBlock) {
    function clickHandler(e: React.MouseEvent<HTMLDivElement>, treeBlock: IBlock) {
        boardListStore.viewBoard(treeBlock);
    }
    function dragStartHandler (e: React.DragEvent<HTMLDivElement>, treeBlock: IBlock) {
        const boardList = boardListStore.boardList.find((element) => {
            return element.id === treeBlock.boardId;
        });
        if (typeof treeBlock.id !== "undefined") {
            const currentIndex = boardList?.blockIdList.indexOf(treeBlock.id);
            e.dataTransfer.setData("currentBlockIndex", String(currentIndex));
            e.dataTransfer.setData("currentBlockId", String(treeBlock.id));
            const target = e.currentTarget;
            target.style.background = 'white';
            setTimeout(() => {
                target.parentElement!.style.display = 'none';
            }, 0);
        }
    }
    function dragEndHandler (e: React.DragEvent<HTMLDivElement>) {
        e.currentTarget.parentElement!.style.display = 'block';
    }

    function dragLeaveBlockHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.currentTarget.style.background = 'white';
    }

    function dragEnterBlockHandler(e: React.DragEvent<HTMLDivElement>, selectBlock: IBlock) {
        e.preventDefault();
        const currentBlockId = Number(e.dataTransfer.getData("currentBlockId"));
        if (selectBlock.id !== currentBlockId) {
            e.currentTarget.style.background = '#B1C3FDD1';
        }
        boardListStore.viewBoard(selectBlock);
    }

    function dragOverBlockHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
    }

    function dropBlockHandler (e: React.DragEvent<HTMLDivElement>, treeBlock: IBlock) {
        e.preventDefault();
        e.currentTarget.style.background = 'white';
        const board = boardListStore.boardList.find((element) => element.id === treeBlock.boardId);
        const currentBlockId = Number(e.dataTransfer.getData("currentBlockId"));
        if (treeBlock.id === currentBlockId) {
            return true;
        }
        const currentBlock = treeBlockListStore.blockList.find((element) => element.id === currentBlockId);
        if (board && currentBlock) {
            const currentBoard = boardListStore.boardList.find((element) => element.id === currentBlock.boardId);
            if (currentBoard) {
                if (board.boardLine === currentBoard.boardLine) {
                    boardListStore.moveAllBlocks(currentBlock, treeBlock, board);
                } if (board.boardLine === currentBoard.boardLine - 1) {
                    boardListStore.moveBottomBlockInAnotherAbove(currentBlock, treeBlock);
                }
            }
        }
    }

    function viewBlockInfoCLick(e: React.MouseEvent<HTMLButtonElement>, props: IBlock) {
        e.stopPropagation();
    }

    return (
        <div key={props.id}>
            <div
                onDragStart={(e) => dragStartHandler(e, props)}
                onDragEnd={(e) => dragEndHandler(e)}
                onClick={(e) => clickHandler(e, props)}
                onDragLeave={(e) => dragLeaveBlockHandler(e)}
                onDragEnter={(e) => dragEnterBlockHandler(e, props)}
                onDragOver={(e) => dragOverBlockHandler(e)}
                onDrop={(e) => dropBlockHandler(e, props)}
                draggable={true}
                className="block">
                    <div>
                        {props.name}
                    </div>
                    <button onClick={(e) => viewBlockInfoCLick(e, props)}>+</button>
            </div>
        </div>
    );
}

export default observer(Block);