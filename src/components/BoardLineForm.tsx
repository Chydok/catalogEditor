import React, {FC, ReactNode, useEffect, useRef, useState} from "react";
import {observer} from "mobx-react";

import '../styles/ModalForm.css';
import '../styles/EditBoardLineForm.css'
import boardLineStore, {IBlockStructure, IBoardLine} from "../stores/boardLineStore";

interface IBoardLineForm {
    boardLineId: number;
    active: boolean;
    setActive: (active: boolean) => void;
    children?: ReactNode;
}

const BoardLineForm: FC<IBoardLineForm> = (props) => {
    const inputBoardLineName = useRef<HTMLInputElement>(null);
    const checkLogicBoard = useRef<HTMLInputElement>(null);
    const checkLastBoard = useRef<HTMLInputElement>(null);

    const inputNameEn = useRef<HTMLInputElement>(null);
    const inputNameRu = useRef<HTMLInputElement>(null);
    const variableType = useRef<HTMLSelectElement>(null);

    const boardLine = boardLineStore.boardLineList.find(item => item.id === props.boardLineId);
    const [variables, setVariables] = useState<Array<IBlockStructure>>(boardLine?.boardStructure || []);
    const saveValue = () => {
        const boardLine = boardLineStore.boardLineList.find(item => item.id === props.boardLineId);
        if (typeof boardLine === "undefined") {
            const newBoardLine: IBoardLine = {
                id: props.boardLineId,
                name: inputBoardLineName.current?.value,
                logicLine: checkLogicBoard.current?.checked,
                lastLine: checkLastBoard.current?.checked,
                boardStructure: variables,
            }
            boardLineStore.addBlockLine(newBoardLine);
        } else {
            boardLineStore.updateBlockLine({
                id: props.boardLineId,
                name: inputBoardLineName.current?.value,
                logicLine: checkLogicBoard.current?.checked,
                lastLine: checkLogicBoard.current?.checked,
                boardStructure: variables,
            });
        }
        props.setActive(false);
    }

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
    useEffect(() => {

    }, [variables.length])
    return (
        <div
            className={props.active ? "editBoardMain active" : "editBoardMain"}
            onClick={() => saveValue()}>
            <div
                className={props.active ? "editBoardForm active" : "editBoardForm"}
                onClick={e => e.stopPropagation()}>
                <div className="editBoardLineForm">
                    <div className="headerBoardLine">
                        <div>
                            <label>
                                Имя уровня:
                                <input
                                    type="input"
                                    ref={inputBoardLineName}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Разрешить логические блоки:
                                <input
                                    type="checkbox"
                                    ref={checkLogicBoard}
                                />
                            </label>
                            <label>
                                Последний уровень:
                                <input
                                    type="checkbox"
                                    ref={checkLastBoard}
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
                            >Добавить</button>
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
                </div>
            </div>
        </div>
    );
}

export default observer(BoardLineForm);