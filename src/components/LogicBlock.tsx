import React, {FC} from "react";
import {observer} from "mobx-react";

import Block from "./Block";
import blockListStore, {IBlock} from "../stores/blockListStore";
import {IBlockStructure} from "../stores/boardLineStore";

interface ILogicBlockComponent extends IBlock {
    selectedBlockList: Array<number>;
    selectedBoardId: number|undefined;
    changeBoardSize: () => void;
    boardLine?: number;
    blockFormEdit?: Array<IBlockStructure>;
    addSelectedBlockList: (blockId: number) => void;
    removeSelectedBlockId: (blockId: number) => void;
    updateSelectedBoardId: (boardId: number) => void;
    setLogicBlockEdit: (className: string) => void;
}
const LogicBlock: FC<ILogicBlockComponent> = (props: ILogicBlockComponent) => {
    return (
        <div key={props.id}>
            {props.logicList?.map((idBlock) => {
                const insertedBlock = blockListStore.blockList.find((item) => item.id === idBlock);
                if (insertedBlock) {
                    return (
                        <Block
                            className="block blockInserted"
                            key={insertedBlock.id}
                            id={insertedBlock.id}
                            boardId={insertedBlock.boardId}
                            blockFormEdit={props.blockFormEdit || []}
                            boardLine={props.boardLine}
                            selectedBlockList={props.selectedBlockList}
                            selectedBoardId={props.selectedBoardId}
                            form={insertedBlock.form}
                            logic={false}
                            addSelectedBlockList={props.addSelectedBlockList}
                            removeSelectedBlockId={props.removeSelectedBlockId}
                            changeBoardSize={() => props.changeBoardSize()}
                            updateSelectedBoardId={props.updateSelectedBoardId}
                            setLogicBlockClass={props.setLogicBlockEdit}
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