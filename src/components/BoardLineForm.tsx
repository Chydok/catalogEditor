import React, {FC, useEffect, useRef, useState} from "react";
import {observer} from "mobx-react";

import '../styles/ModalForm.css';
import '../styles/EditBoardLineForm.css'
import boardLineStore, {IBlockStructure, IBoardLine} from "../stores/boardLineStore";

interface IBoardLineForm {
    boardLineId: number;
    active: boolean;
}

const BoardLineForm: FC<IBoardLineForm> = (props) => {
    const [boardLineForm, setBoardLineForm] = useState<{name: string, checkLogicBoard: boolean, checkLastBoard: boolean}>(() => {
        return {
            name: '',
            checkLastBoard: false,
            checkLogicBoard: false
        }
    });
    const [variables, setVariables] = useState<Array<IBlockStructure>>([]);

    const inputNameEn = useRef<HTMLInputElement>(null);
    const inputNameRu = useRef<HTMLInputElement>(null);
    const variableType = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        const saveValue = () => {
            const boardLine = boardLineStore.boardLineList.find(item => item.id === props.boardLineId);
            const newBoardLine: IBoardLine = {
                id: props.boardLineId,
                name: boardLineForm.name,
                logicLine: boardLineForm.checkLogicBoard,
                lastLine: boardLineForm.checkLastBoard,
                boardStructure: variables,
            }
            if (typeof boardLine === "undefined" && props.boardLineId) {
                boardLineStore.addBlockLine(newBoardLine);
            } else {
                boardLineStore.updateBlockLine(newBoardLine);
            }
        };
        if (!props.active) {
            saveValue();
            setBoardLineForm({
                name: '',
                checkLastBoard: false,
                checkLogicBoard: false
            });
            if (inputNameEn.current && inputNameRu.current && variableType.current) {
                inputNameEn.current.value = '';
                inputNameRu.current.value = '';
                variableType.current.value = 'text';
            }
            setVariables([]);
        } else {
            const boardLine = boardLineStore.boardLineList.find(item => item.id === props.boardLineId);
            const newElem = {
                name: boardLine?.name ? boardLine.name : '',
                checkLastBoard: boardLine?.lastLine ? boardLine.lastLine : false,
                checkLogicBoard: boardLine?.logicLine ? boardLine.logicLine : false,
            };
            setBoardLineForm(() => (newElem));
            setVariables(boardLine?.boardStructure ? boardLine.boardStructure : []);
        }
        // eslint-disable-next-line
    }, [props.active, props.boardLineId]);

    function addVariableField() {
        if (inputNameEn.current && inputNameEn.current.value !== '' && inputNameEn.current.value !== null &&
            inputNameRu.current && inputNameRu.current.value !== '' &&
            variableType.current) {
            const find = variables.find(item => item.nameEn === inputNameEn.current?.value)
            if (!find) {
                const newElem = {
                    nameEn: inputNameEn.current.value,
                    nameRu: inputNameRu.current.value,
                    type: variableType.current.value
                };
                setVariables(oldArr => [...oldArr, newElem]);
                inputNameEn.current.value = '';
                inputNameRu.current.value = '';
                variableType.current.value = 'text';
            }
        }
    }

    return (props.active ?
        <div className="editBoardLineForm">
            <div className="headerBoardLine">
                <div>
                    <label>
                        Имя уровня:
                        <input
                            type="input"
                            value={boardLineForm?.name}
                            onChange={e => setBoardLineForm((prevState) => (
                                {...prevState, name: e.target.value}))}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Разрешить логические блоки:
                        <input
                            type="checkbox"
                            checked={boardLineForm.checkLogicBoard}
                            onChange={e => setBoardLineForm((prevState) => (
                                {...prevState, checkLogicBoard: e.target.checked}))}
                        />
                    </label>
                    <label>
                        Последний уровень:
                        <input
                            type="checkbox"
                            checked={boardLineForm.checkLastBoard}
                            onChange={e => setBoardLineForm((prevState) => (
                                {...prevState, checkLastBoard: e.target.checked}))}
                        />
                    </label>
                </div>
            </div>
            <div className="textInfo">Новая переменная:</div>
            <div className="newBlockVariable">
                <div>
                    <label>
                        Имя на английском:
                        <input
                            type="input"
                            ref={inputNameEn}
                        />
                    </label>
                    <label>
                        Имя на русском:
                        <input
                            type="input"
                            ref={inputNameRu}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Тип переменной:
                        <select ref={variableType}>
                            <option value="text">Текст</option>
                            <option value="number">Число</option>
                            <option value="date">Дата</option>
                            <option value="boolean">Логический</option>
                            <option value="range">Диапазон</option>
                        </select>
                    </label>
                    <button
                        className="addVariable"
                        onClick={() => addVariableField()}
                    >Добавить
                    </button>
                </div>
            </div>
            <div className="textInfo">Список переменных:</div>
            <div className="variablesListBlock">
                {variables.map((item) => {
                    return (
                        <div key={item.nameEn} className="variablesList">
                            <div className="variablesListText">
                                {item.nameEn} {item.nameRu} {item.type}
                            </div>
                            <button>Удалить</button>
                        </div>
                    )
                })}
            </div>
        </div> : <div />
    );
}

export default observer(BoardLineForm);