import React, {useState} from 'react';
import {observer} from "mobx-react";

import Board from "./components/Board";
import blockListStore from "./stores/blockListStore";
import boardStore, {IBoard} from "./stores/boardListStore";
import MainMenu from "./components/MainMenu";

import './App.css';

blockListStore.removeAllBlock();
boardStore.removeAllBoards();

blockListStore.addBlock({name: 'Основа 1', boardId: 1, logic: false});
blockListStore.addBlock({name: 'Основа 2', boardId: 1, logic: false});
blockListStore.addBlock({name: 'Установка 1', boardId: 2, logic: false});
blockListStore.addBlock({name: 'Установка 2', boardId: 2, logic: false});
blockListStore.addBlock({name: 'Установка 3', boardId: 2, logic: false});
blockListStore.addBlock({name: 'Установка 4', boardId: 2, logic: false});
blockListStore.addBlock({name: 'Установка 5', boardId: 3, logic: false});
blockListStore.addBlock({name: 'Установка 6', boardId: 3, logic: false});
blockListStore.addBlock({name: 'Установка 7', boardId: 3, logic: false});
blockListStore.addBlock({name: 'Установка 8', boardId: 3, logic: false});
blockListStore.addBlock({name: 'Блок 1', boardId: 4, logic: false});
blockListStore.addBlock({name: 'Блок 2', boardId: 4, logic: false});
blockListStore.addBlock({name: 'Блок 3', boardId: 4, logic: false});
blockListStore.addBlock({name: 'Блок 4', boardId: 4, logic: false});
blockListStore.addBlock({name: 'Блок 5', boardId: 5, logic: false});
blockListStore.addBlock({name: 'Блок 6', boardId: 5, logic: false});
blockListStore.addBlock({name: 'Блок 7', boardId: 5, logic: false});
blockListStore.addBlock({name: 'Блок 8', boardId: 5, logic: false});

boardStore.addBoard([
    {id: 1, blockIdList: [0,1], viewBoard: true, boardLine: 1},
    {id: 2, blockIdList: [2,3,4,5], parentBlock: 0, viewBoard: false, boardLine: 2},
    {id: 3, blockIdList: [6,7,8,9], parentBlock: 1, viewBoard: false, boardLine: 2},
    {id: 4, blockIdList: [10,11,12,13], parentBlock: 5, viewBoard: false, boardLine: 3},
    {id: 5, blockIdList: [14,15,16,17], parentBlock: 6, viewBoard: false, boardLine: 3}
]);

const boardList: Array<IBoard> | undefined = boardStore.boardList;
function App() {
    let [selectedBlockIdList, setSelectedBlockIdList] = useState<Array<number>>([]);
    let [selectedBoardId, setSelectedBoardId] = useState<number>();

    const addSelectedBlockList = (blockId: number) => {
        selectedBlockIdList.push(blockId)
        setSelectedBlockIdList(selectedBlockIdList);
    }

    const removeSelectedBlockId = (blockId: number) => {
        selectedBlockIdList.splice(selectedBlockIdList.indexOf(blockId));
        setSelectedBlockIdList(selectedBlockIdList);
    }

    const updateSelectedBoardId = (boardId: number) => {
        setSelectedBoardId(boardId);
    }

    return (
        <div className="app">
            <MainMenu />
            <div className="boardList">
                {boardList?.map(board => {
                    if (board.viewBoard) {
                        return (
                            <Board
                                key={board.id}
                                id={board.id}
                                blockIdList={board.blockIdList}
                                viewBoard={board.viewBoard}
                                boardLine={board.boardLine}
                                selectedBoardId={selectedBoardId}
                                selectedBlockList={selectedBlockIdList}
                                addSelectedBlockList={addSelectedBlockList}
                                removeSelectedBlockId={removeSelectedBlockId}
                                updateSelectedBoardId={updateSelectedBoardId}
                            />
                        );
                    }
                    return true;
                })}
            </div>
        </div>
    );
}

export default observer(App);