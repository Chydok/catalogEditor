import React from 'react';
import './App.css';
import treeBlockListStore, {ItreeBlockStore} from "./stores/treeBlockListStore";
import {observer} from "mobx-react";
import Board from "./components/Board";
import boardStore, {IBoardList} from "./stores/boardStore";
import TreeBlock from "./components/TreeBlock";

treeBlockListStore.removeAllTreeBlock();
treeBlockListStore.addTreeBlock({name: 'corp', boardIndex: 1});
treeBlockListStore.addTreeBlock({name: 'corp', boardIndex: 1});
treeBlockListStore.addTreeBlock({name: 'corp', boardIndex: 1});
treeBlockListStore.addTreeBlock({name: 'corp', boardIndex: 1});
treeBlockListStore.addTreeBlock({name: 'Установка', boardIndex: 2});
treeBlockListStore.addTreeBlock({name: 'Установка', boardIndex: 2});
treeBlockListStore.addTreeBlock({name: 'Установка', boardIndex: 2});
treeBlockListStore.addTreeBlock({name: 'Установка', boardIndex: 2});
treeBlockListStore.addTreeBlock({name: 'Установка', boardIndex: 3});
treeBlockListStore.addTreeBlock({name: 'Установка', boardIndex: 3});
treeBlockListStore.addTreeBlock({name: 'Установка', boardIndex: 3});
treeBlockListStore.addTreeBlock({name: 'Установка', boardIndex: 3});
treeBlockListStore.addTreeBlock({name: 'Блок', boardIndex: 4});
treeBlockListStore.addTreeBlock({name: 'Блок', boardIndex: 4});
treeBlockListStore.addTreeBlock({name: 'Блок', boardIndex: 4});
treeBlockListStore.addTreeBlock({name: 'Блок', boardIndex: 4});
treeBlockListStore.addTreeBlock({name: 'Блок', boardIndex: 5});
treeBlockListStore.addTreeBlock({name: 'Блок', boardIndex: 5});
treeBlockListStore.addTreeBlock({name: 'Блок', boardIndex: 5});
treeBlockListStore.addTreeBlock({name: 'Блок', boardIndex: 5});
const treeBlockList = treeBlockListStore.treeBlockList;

boardStore.addBoard([
    {id: 1, blockIdList: [1,2,3,4], viewBoard: true},
    {id: 2, blockIdList: [5,6,7,8], parentTreeBlock: 2, viewBoard: false},
    {id: 3, blockIdList: [9,10,11,12], parentTreeBlock: 3, viewBoard: false},
    {id: 4, blockIdList: [13,14,15,16], parentTreeBlock: 10, viewBoard: false},
    {id: 5, blockIdList: [17,18,19,20], parentTreeBlock: 11, viewBoard: false}
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
                        >
                            {board.blockIdList.map((treeBlockId) => {
                                const block: ItreeBlockStore | undefined = treeBlockList.find(element => element.id === treeBlockId);
                                return (block ?
                                    <TreeBlock
                                        key={block.id}
                                        id={block.id}
                                        name={block.name}
                                        order={block.order}
                                        boardIndex={block.boardIndex}
                                    />
                                 : <div/>);
                            })}
                        </Board>
                    );
                }
            })}
        </div>
    );
}

export default observer(App);