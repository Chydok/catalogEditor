import React, {FC} from "react";
import {observer} from "mobx-react";

import Block from "./Block";
import {IBlock} from "../stores/blockListStore";
import blockListStore from "../stores/blockListStore";

interface ILogicBlockComponent extends IBlock {
    selectedBlockList: Array<number>;
    selectedBoardId: number|undefined;
    changeBoardSize: () => void;
    addSelectedBlockList: (blockId: number) => void;
    removeSelectedBlockId: (blockId: number) => void;
    updateSelectedBoardId: (boardId: number) => void;
}
const LogicBlock: FC<ILogicBlockComponent> = (props: ILogicBlockComponent) => {
    return (
        <div key={props.id} className="logicBlock">
            {props.logicList?.map((idBlock) => {
                const insertedBlock = blockListStore.blockList.find((item) => item.id === idBlock);
                if (insertedBlock) {
                    return (
                        <Block
                            key={insertedBlock.id}
                            id={insertedBlock.id}
                            name={insertedBlock.name}
                            boardId={insertedBlock.boardId}
                            className="block blockInserted"
                            selectedBlockList={props.selectedBlockList}
                            selectedBoardId={props.selectedBoardId}
                            logic={false}
                            addSelectedBlockList={() => props.addSelectedBlockList}
                            removeSelectedBlockId={() => props.removeSelectedBlockId}
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