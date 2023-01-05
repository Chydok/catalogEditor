import React, {useState} from "react";
import treeBlockListStore, {ItreeBlockStore} from "../stores/treeBlockListStore";
import {observer} from "mobx-react";
import boardStore from "../stores/boardStore";

function TreeBlock (props: ItreeBlockStore) {
    function dragStartHandler (e: React.DragEvent<HTMLDivElement>, treeBlock: ItreeBlockStore) {
        e.dataTransfer.setData("currentBlock", String(treeBlock.id));
        const target = e.currentTarget;
        e.currentTarget.style.background = 'white';
        setTimeout(() => {
            target.parentElement!.style.display = 'none';
        },0);
    }
    function dragEndHandler (e: React.DragEvent<HTMLDivElement>) {
        e.currentTarget.parentElement!.style.display = 'block';
    }
    function dragLeaveHandler (e: React.DragEvent<HTMLDivElement>) {
        e.currentTarget.style.background = 'white';
    }

    function dragOverHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.currentTarget.style.background = 'lightgray';
    }

    function dropHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        const currentBlockOrder = Number(e.dataTransfer.getData("currentBlock"));
        let newIndex = Number(e.currentTarget.dataset.key);
        treeBlockListStore.moveTreeBlock(newIndex, currentBlockOrder)
        e.currentTarget.style.background = 'white';
    }

    function clickHandler(e: React.MouseEvent<HTMLDivElement>, props: ItreeBlockStore) {
        boardStore.viewBoard(props);
    }

    return (
        <div key={props.id}>
            <div
                data-key={props.id}
                onDrop={(e) => dropHandler(e)}
                onDragLeave={(e) => dragLeaveHandler(e)}
                onDragOver={(e) => dragOverHandler(e)}
                className="dropBox"/>
            <div
                onDragStart={(e) => dragStartHandler(e, props)}
                onDragEnd={(e) => dragEndHandler(e)}
                onClick={(e) => clickHandler(e, props)}
                draggable={true}
                className="treeBlock">
                    {props.name} {props.order}
            </div>
        </div>
    );
}

export default observer(TreeBlock);