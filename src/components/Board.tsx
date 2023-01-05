import React from 'react';
import treeBlockListStore from "../stores/treeBlockListStore";
import {observer} from "mobx-react";
import {IBoardList} from "../stores/boardStore";

function Board(props: IBoardList) {
    return (
        <div key={props.id} className="board">
            <button
                className="addTreeBlock"
                onClick={() => {
                        treeBlockListStore.addTreeBlock({
                            name: 'Test',
                            parentBlockId: props.id
                        });

                    }
                }
            >+</button>
            {props.children}
        </div>
    );
}

export default observer(Board);
