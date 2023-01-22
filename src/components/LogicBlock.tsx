import React, {FC} from "react";
import {observer} from "mobx-react";

import Block from "./Block";
import {IBlock} from "../stores/blockListStore";
import blockListStore from "../stores/blockListStore";
import boardLineStore from "../stores/boardLineStore";

interface ILogicBlockComponent extends IBlock {
    selectedBlockList: Array<number>;
    selectedBoardId: number|undefined;
    changeBoardSize: () => void;
    boardLine?: number;
    addSelectedBlockList: (blockId: number) => void;
    removeSelectedBlockId: (blockId: number) => void;
    updateSelectedBoardId: (boardId: number) => void;
}
const LogicBlock: FC<ILogicBlockComponent> = (props: ILogicBlockComponent) => {
    const boardLine = boardLineStore.boardLineList.find(item => item.id === props.id);
    return (
        <div key={props.id} className="logicBlock">
            {props.logicList?.map((idBlock) => {
                const insertedBlock = blockListStore.blockList.find((item) => item.id === idBlock);
                if (insertedBlock) {
                    return (
                        <Block
                            className="block blockInserted"
                            key={insertedBlock.id}
                            id={insertedBlock.id}
                            name={insertedBlock.name}
                            boardId={insertedBlock.boardId}
                            blockFormEdit={boardLine?.boardStructure || []}
                            boardLine={props.boardLine}
                            selectedBlockList={props.selectedBlockList}
                            selectedBoardId={props.selectedBoardId}
                            logic={false}
                            addSelectedBlockList={props.addSelectedBlockList}
                            removeSelectedBlockId={props.removeSelectedBlockId}
                            changeBoardSize={() => props.changeBoardSize()}
                            updateSelectedBoardId={props.updateSelectedBoardId}
                        />
                    );
                } else {
                    return <div/>
                }
            })}
        </div>
    );
}

export default observer(LogicBlock);