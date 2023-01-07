import React from "react";
import treeBlockListStore, {ItreeBlockStore} from "../stores/treeBlockListStore";
import {observer} from "mobx-react";
import boardStore from "../stores/boardStore";
import BoardStore from "../stores/boardStore";

function TreeBlock (props: ItreeBlockStore) {
    function dragStartHandler (e: React.DragEvent<HTMLDivElement>, treeBlock: ItreeBlockStore) {
        const boardList = boardStore.boardList.find((element) => {
            return element.id === treeBlock.boardId;
        });
        if (typeof treeBlock.id !== "undefined") {
            const currentIndex = boardList?.blockIdList.indexOf(treeBlock.id);
            e.dataTransfer.setData("currentBlockIndex", String(currentIndex));
            e.dataTransfer.setData("currentTreeBlock", String(treeBlock.id));
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

    function clickHandler(e: React.MouseEvent<HTMLDivElement>, treeBlock: ItreeBlockStore) {
        boardStore.viewBoard(treeBlock);
    }

    function dragLeaveBlockHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.currentTarget.style.background = 'white';
    }

    function dragEnterBlockHandler(e: React.DragEvent<HTMLDivElement>, treeBlock: ItreeBlockStore) {
        e.preventDefault();
        const currentTreeBlockId = Number(e.dataTransfer.getData("currentTreeBlock"));
        if (treeBlock.id !== currentTreeBlockId) {
            e.currentTarget.style.background = '#7094FFD1';
        }
    }

    function dropBlockHandler (e: React.DragEvent<HTMLDivElement>, treeBlock: ItreeBlockStore) {
        e.preventDefault();
        e.currentTarget.style.background = 'white';
        const board = BoardStore.boardList.find((element) => element.id === treeBlock.boardId);
        const currentTreeBlockId = Number(e.dataTransfer.getData("currentTreeBlock"));
        const currentTreeBlock = treeBlockListStore.treeBlockList.find((element) => element.id === currentTreeBlockId);
        if (board && currentTreeBlock) {
            const currentBoard = BoardStore.boardList.find((element) => element.id === currentTreeBlock.boardId);
            if (currentBoard) {
                if (board.boardLine === currentBoard.boardLine) {
                    console.log(111);
                } if (board.boardLine === currentBoard.boardLine - 1) {
                    console.log(222);
                }
            }
        }
    }

    function dragOverBlockHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
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
                className="treeBlock">
                    {props.name} {props.id}
            </div>
        </div>
    );
}

export default observer(TreeBlock);