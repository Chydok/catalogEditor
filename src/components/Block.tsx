import React, {FC, useState} from "react";
import {observer} from "mobx-react";

import LogicBlock from "./LogicBlock";
import treeBlockListStore, {IBlock} from "../stores/blockListStore";
import boardListStore from "../stores/boardListStore";
import blockListStore from "../stores/blockListStore";

interface IBlockComponent extends IBlock {
    className: string;
    changeBoardSize: () => void
}
const Block: FC<IBlockComponent> = (props: IBlockComponent) => {
    const [classBlockName, setClassBlockName] = useState(props.className);
    function clickHandler(e: React.MouseEvent<HTMLDivElement>, treeBlock: IBlock) {
        e.stopPropagation();
        if (!treeBlock.logic) {
            boardListStore.viewBoard(treeBlock);
        }
    }

    function dragStartHandler(e: React.DragEvent<HTMLDivElement>, treeBlock: IBlock) {
        e.stopPropagation();
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
                target.style.display = 'none';
            }, 0);
        }
    }

    function dragEndHandler (e: React.DragEvent<HTMLDivElement>) {
        e.currentTarget.style.display = 'block';
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

    function dropBlockHandler(e: React.DragEvent<HTMLDivElement>, block: IBlock) {
        e.preventDefault();
        e.currentTarget.style.background = 'white';
        const currentBlockId = Number(e.dataTransfer.getData("currentBlockId"));
        if (e.currentTarget.className === "block blockEdit" || block.logic) {
            blockListStore.addInLogicBlock(block, [currentBlockId]);
            if (e.currentTarget.className === "block blockEdit") {
                props.changeBoardSize();
                setClassBlockName(props.className);
            }
        } else {
            const board = boardListStore.boardList.find((element) => element.id === block.boardId);
            if (block.id === currentBlockId) {
                return true;
            }
            const currentBlock = treeBlockListStore.blockList.find((element) => element.id === currentBlockId);
            if (board && currentBlock) {
                const currentBoard = boardListStore.boardList.find((element) => element.id === currentBlock.boardId);
                if (currentBoard) {
                    if (board.boardLine === currentBoard.boardLine) {
                        boardListStore.moveAllBlocks(currentBlock, block, board);
                    }
                    if (board.boardLine === currentBoard.boardLine - 1) {
                        boardListStore.moveBottomBlockInAnotherAbove(currentBlock, block);
                    }
                }
            }
        }
    }

    function viewBlockInfoCLick(e: React.MouseEvent<HTMLButtonElement>, props: IBlockComponent) {
        e.stopPropagation();
        props.changeBoardSize();
        setClassBlockName(
            classBlockName !== props.className + ' blockEdit'
                ? props.className + ' blockEdit'
                : props.className);
    }

    const editIcon = require("../icons/edit.png");
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
                className={classBlockName}>
                <div className="blockDiv">
                    {props.name}
                    <button onClick={(e) => viewBlockInfoCLick(e, props)}>
                        <img src={editIcon} className="editIcon" alt={"edit"}/>
                    </button>
                </div>
                {props.logic ?
                    <LogicBlock
                        id={props.id}
                        name={props.name}
                        boardId={props.boardId}
                        logicList={props.logicList}
                        changeBoardSize={props.changeBoardSize}
                        logic={false}/>
                    : ''}
            </div>
        </div>
    );
}

export default observer(Block);