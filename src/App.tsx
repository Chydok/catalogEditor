import React from 'react';
import './App.css';
import treeBlockListStore from "./stores/treeBlockListStore";
import {observer} from "mobx-react";
import Board from "./components/Board";
import boardStore, {IBoardList} from "./stores/boardStore";

treeBlockListStore.removeAllTreeBlock();
treeBlockListStore.addTreeBlock({name: 'corp', boardId: 1});
treeBlockListStore.addTreeBlock({name: 'corp', boardId: 1});
treeBlockListStore.addTreeBlock({name: 'corp', boardId: 1});
treeBlockListStore.addTreeBlock({name: 'corp', boardId: 1});
treeBlockListStore.addTreeBlock({name: 'Установка', boardId: 2});
treeBlockListStore.addTreeBlock({name: 'Установка', boardId: 2});
treeBlockListStore.addTreeBlock({name: 'Установка', boardId: 2});
treeBlockListStore.addTreeBlock({name: 'Установка', boardId: 2});
treeBlockListStore.addTreeBlock({name: 'Установка', boardId: 3});
treeBlockListStore.addTreeBlock({name: 'Установка', boardId: 3});
treeBlockListStore.addTreeBlock({name: 'Установка', boardId: 3});
treeBlockListStore.addTreeBlock({name: 'Установка', boardId: 3});
treeBlockListStore.addTreeBlock({name: 'Блок', boardId: 4});
treeBlockListStore.addTreeBlock({name: 'Блок', boardId: 4});
treeBlockListStore.addTreeBlock({name: 'Блок', boardId: 4});
treeBlockListStore.addTreeBlock({name: 'Блок', boardId: 4});
treeBlockListStore.addTreeBlock({name: 'Блок', boardId: 5});
treeBlockListStore.addTreeBlock({name: 'Блок', boardId: 5});
treeBlockListStore.addTreeBlock({name: 'Блок', boardId: 5});
treeBlockListStore.addTreeBlock({name: 'Блок', boardId: 5});

boardStore.addBoard([
    {id: 1, blockIdList: [0,1,2,3], viewBoard: true, boardLine: 1},
    {id: 2, blockIdList: [4,5,6,7], parentTreeBlock: 2, viewBoard: false, boardLine: 2},
    {id: 3, blockIdList: [8,9,10,11], parentTreeBlock: 3, viewBoard: false, boardLine: 2},
    {id: 4, blockIdList: [12,13,14,15], parentTreeBlock: 10, viewBoard: false, boardLine: 3},
    {id: 5, blockIdList: [16,17,18,19], parentTreeBlock: 11, viewBoard: false, boardLine: 3}
]);

const boardList: Array<IBoardList> | undefined = boardStore.boardList;
function App() {
    return (
        <div className="app">
            {boardList?.map(board => {
                if (board.viewBoard) {
                    return (
                        <Board
                            key={board.id}
                            id={board.id}
                            blockIdList={board.blockIdList}
                            viewBoard={board.viewBoard}
                            boardLine={board.boardLine}
                        />
                    );
                }
                return true;
            })}
        </div>
    );
}

export default observer(App);