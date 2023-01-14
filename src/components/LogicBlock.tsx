import React, {FC} from "react";
import {observer} from "mobx-react";

import {IBlock} from "../stores/blockListStore";
import blockListStore from "../stores/blockListStore";
import Block from "./Block";

interface ILogicBlockComponent extends IBlock {
    changeBoardSize: () => void
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
                            logic={false}
                            changeBoardSize={() => props.changeBoardSize()}
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