import React, {FC, useState} from "react";
import {observer} from "mobx-react";

import LogicBlock from "./LogicBlock";
import treeBlockListStore, {IBlock} from "../stores/blockListStore";
import boardListStore from "../stores/boardListStore";
import blockListStore from "../stores/blockListStore";

interface IBlockComponent extends IBlock {
    className: string;
    selectedBlockList: Array<number>;
    selectedBoardId: number|undefined;
    changeBoardSize: () => void;
    addSelectedBlockList: (blockId: number) => void;
    removeSelectedBlockId: (blockId: number) => void;
    updateSelectedBoardId: (boardId: number) => void;
}
const Block: FC<IBlockComponent> = (props: IBlockComponent) => {
    const [classBlockName, setClassBlockName] = useState(props.className);

    function clickHandler(e: React.MouseEvent<HTMLDivElement>, Block: IBlock) {
        e.stopPropagation();
        if (e.shiftKey) {
            if (typeof Block.id !== "undefined") {
                if (classBlockName.indexOf('blockSelected') === -1) {
                    props.addSelectedBlockList(Block.id);
                } else {
                    props.removeSelectedBlockId(Block.id);
                }
            }
            setClassBlockName(classBlockName.indexOf('blockSelected') !== -1 ? props.className : classBlockName + ' blockSelected');
        } else {
            if (!Block.logic) {
                boardListStore.viewBoard(Block);
            }
        }
    }

    function dragStartHandler(e: React.DragEvent<HTMLDivElement>, Block: IBlock) {
        e.stopPropagation();
        if (typeof Block.id !== "undefined") {
            if (props.selectedBlockList.indexOf(Block.id) === -1) {
                props.addSelectedBlockList(Block.id);
            }
            const target = e.currentTarget;
            target.style.background = 'white';
            setTimeout(() => {
                target.style.display = 'none';
            }, 0);
        }
    }

    function dragEndHandler (e: React.DragEvent<HTMLDivElement>, Block: IBlockComponent) {
        e.preventDefault();
        if (typeof Block.id !== "undefined") {
            props.removeSelectedBlockId(Block.id);
        }
        e.currentTarget.style.display = 'block';
    }

    function dragLeaveBlockHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.currentTarget.style.background = 'white';
    }

    function dragEnterBlockHandler(e: React.DragEvent<HTMLDivElement>, selectBlock: IBlock) {
        e.preventDefault();
        if (selectBlock.id !== undefined && props.selectedBlockList.indexOf(selectBlock.id) !== -1) {
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
        if (e.currentTarget.className === "block blockEdit" || block.logic) {
            console.log(props.selectedBlockList)
            blockListStore.addInLogicBlock(block, props.selectedBlockList);
            if (e.currentTarget.className === "block blockEdit") {
                props.changeBoardSize();
                setClassBlockName(props.className);
            }
        } else {
            for (let currentBlockId of props.selectedBlockList) {
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
        for (let currentBlockId of props.selectedBlockList) {
            props.removeSelectedBlockId(currentBlockId);
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
                onDragEnd={(e) => dragEndHandler(e, props)}
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
                        selectedBlockList={props.selectedBlockList}
                        selectedBoardId={props.selectedBoardId}
                        changeBoardSize={props.changeBoardSize}
                        addSelectedBlockList={props.addSelectedBlockList}
                        removeSelectedBlockId={props.removeSelectedBlockId}
                        updateSelectedBoardId={props.updateSelectedBoardId}
                        logic={false}/>
                    : ''}
            </div>
        </div>
    );
}

export default observer(Block);