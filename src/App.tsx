import React, {ReactNode, useEffect, useState} from 'react';
import {observer} from "mobx-react";

import Board from "./components/Board";
import MainMenu from "./components/MainMenu";
import ModalForm from "./components/ModalForm";
import BoardLineForm from "./components/BoardLineForm";

import blockListStore from "./stores/blockListStore";
import boardStore, {IBoard} from "./stores/boardListStore";
import boardLineStore from "./stores/boardLineStore";

import './styles/App.css';
import ForceGraph from "./components/D3Form";

blockListStore.removeAllBlock();
boardStore.removeAllBoards();
boardLineStore.removeAllLines();

blockListStore.addBlock({boardId: 1, logic: false, form: [{nameEn: 'name', nameRu: 'Имя', type: 'text', value: 'Основа 1'}]});
blockListStore.addBlock({boardId: 1, logic: false, form: [{nameEn: 'name', nameRu: 'Имя', type: 'text', value: 'Основа 2'}]});
blockListStore.addBlock({boardId: 2, logic: false, form: [{nameEn: 'name', nameRu: 'Имя', type: 'text', value: 'Установка 1'}]});
blockListStore.addBlock({boardId: 2, logic: false, form: [{nameEn: 'name', nameRu: 'Имя', type: 'text', value: 'Установка 2'}]});
blockListStore.addBlock({boardId: 2, logic: false, form: [{nameEn: 'name', nameRu: 'Имя', type: 'text', value: 'Установка 3'}]});
blockListStore.addBlock({boardId: 2, logic: false, form: [{nameEn: 'name', nameRu: 'Имя', type: 'text', value: 'Установка 4'}]});
blockListStore.addBlock({boardId: 3, logic: false, form: [{nameEn: 'name', nameRu: 'Имя', type: 'text', value: 'Установка 5'}]});
blockListStore.addBlock({boardId: 3, logic: false, form: [{nameEn: 'name', nameRu: 'Имя', type: 'text', value: 'Установка 6'}]});
blockListStore.addBlock({boardId: 3, logic: false, form: [{nameEn: 'name', nameRu: 'Имя', type: 'text', value: 'Установка 7'}]});
blockListStore.addBlock({boardId: 3, logic: false, form: [{nameEn: 'name', nameRu: 'Имя', type: 'text', value: 'Установка 8'}]});
blockListStore.addBlock({boardId: 4, logic: false, form: [{nameEn: 'name', nameRu: 'Имя', type: 'text', value: 'Блок 1'}]});
blockListStore.addBlock({boardId: 4, logic: false, form: [{nameEn: 'name', nameRu: 'Имя', type: 'text', value: 'Блок 2'}]});
blockListStore.addBlock({boardId: 4, logic: false, form: [{nameEn: 'name', nameRu: 'Имя', type: 'text', value: 'Блок 3'}]});
blockListStore.addBlock({boardId: 4, logic: false, form: [{nameEn: 'name', nameRu: 'Имя', type: 'text', value: 'Блок 4'}]});
blockListStore.addBlock({boardId: 5, logic: false, form: [{nameEn: 'name', nameRu: 'Имя', type: 'text', value: 'Блок 5'}]});
blockListStore.addBlock({boardId: 5, logic: false, form: [{nameEn: 'name', nameRu: 'Имя', type: 'text', value: 'Блок 6'}]});
blockListStore.addBlock({boardId: 5, logic: false, form: [{nameEn: 'name', nameRu: 'Имя', type: 'text', value: 'Блок 7'}]});
blockListStore.addBlock({boardId: 5, logic: false, form: [{nameEn: 'name', nameRu: 'Имя', type: 'text', value: 'Блок 8'}]});

boardStore.addBoard([
    {id: 1, blockIdList: [0,1], viewBoard: true, boardLine: 1},
    {id: 2, blockIdList: [2,3,4,5], parentBlock: 0, viewBoard: false, boardLine: 2},
    {id: 3, blockIdList: [6,7,8,9], parentBlock: 1, viewBoard: false, boardLine: 2},
    {id: 4, blockIdList: [10,11,12,13], parentBlock: 5, viewBoard: false, boardLine: 3},
    {id: 5, blockIdList: [14,15,16,17], parentBlock: 6, viewBoard: false, boardLine: 3}
]);

boardLineStore.addBlockLine({id: 1, name: '', boardStructure: [{nameEn: 'name', nameRu: 'Имя', type: 'text'}]});
boardLineStore.addBlockLine({id: 2, name: '', boardStructure: [{nameEn: 'name', nameRu: 'Имя', type: 'text'}]});
boardLineStore.addBlockLine({id: 3, name: '', boardStructure: [{nameEn: 'name', nameRu: 'Имя', type: 'text'}]});
boardLineStore.addBlockLine({id: 4, name: '', boardStructure: [{nameEn: 'name', nameRu: 'Имя', type: 'text'}]});

const boardList: Array<IBoard> | undefined = boardStore.boardList;
function App() {
    const [selectedBlockIdList, setSelectedBlockIdList] = useState<Array<number>>([]);
    const [selectedBoardId, setSelectedBoardId] = useState<number>();
    const [modalFormActive, setModalFormActive] = useState<boolean>(false);
    const [boardLineForm, setBoardLineForm] = useState<ReactNode>();
    const [currentBoardLine, setCurrentBoardLine] = useState<number>(-1);

    const addSelectedBlockList = (blockId: number) => {
        selectedBlockIdList.push(blockId);
        setSelectedBlockIdList(selectedBlockIdList);
    }

    const removeSelectedBlockId = (blockId: number) => {
        selectedBlockIdList.splice(selectedBlockIdList.indexOf(blockId));
        setSelectedBlockIdList(selectedBlockIdList);
    }

    useEffect(() => {
        const viewModalBoardForm = (newState: boolean) => {
            setBoardLineForm(<BoardLineForm boardLineId={currentBoardLine} active={newState}/>)
            setModalFormActive(newState);
        }
        if (modalFormActive) {
            viewModalBoardForm(true);
        } else {
            viewModalBoardForm(false);
        }
    }, [currentBoardLine, modalFormActive])

    return (
        <div className="app">
            <MainMenu />
            <ModalForm
                active={modalFormActive}
                setModalFormActive={setModalFormActive}
            >
                {boardLineForm}
            </ModalForm>
            <ForceGraph />
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
                                setCurrentBoardLine={setCurrentBoardLine}
                                addSelectedBlockList={addSelectedBlockList}
                                removeSelectedBlockId={removeSelectedBlockId}
                                updateSelectedBoardId={setSelectedBoardId}
                                setModalFormActive={setModalFormActive}
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