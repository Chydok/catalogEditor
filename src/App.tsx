import React, {useState} from 'react';
import './App.css';
import treeBlockListStore, {ItreeBlockStore} from "./stores/treeBlockListStore";
import {observer} from "mobx-react";

treeBlockListStore.removeAllTreeBlock();
treeBlockListStore.addTreeBlock({id: 1, order: 4, name: 'Блок'});
treeBlockListStore.addTreeBlock({id: 2, order: 1, name: 'Блок'});
treeBlockListStore.addTreeBlock({id: 3, order: 2, name: 'Блок'});
treeBlockListStore.addTreeBlock({id: 4, order: 3, name: 'Блок'});
const treeBlockList = treeBlockListStore.treeBlockList;
function App() {
    const [currentTreeBlock, setCurrentTreeBlock] = useState<ItreeBlockStore>();
    function dragStartHandler (e: React.DragEvent<HTMLDivElement>, treeBlock: ItreeBlockStore) {
        setCurrentTreeBlock(treeBlock);
    }
    function dragEndHandler (e: React.DragEvent<HTMLDivElement>) {
        e.currentTarget.style.background = 'white';
    }

    function dragOverHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.currentTarget.style.background = 'lightgray';
    }

    function dropHandler(e: React.DragEvent<HTMLDivElement>, treeBlock: ItreeBlockStore) {
        let newIndex = Number(e.currentTarget.dataset.key);
        treeBlockListStore.moveTreeBlock(newIndex, currentTreeBlock!.id - 1, currentTreeBlock)
        e.currentTarget.style.background = 'white';
    }

    let count = 0;
    let EndDropBox: JSX.Element = <div />;
    return (
        <div className="app">
            <div className="addTreeBlock">+</div>
            {treeBlockList.map((treeBlock: ItreeBlockStore) => {
                count++;
                if (count === treeBlockList.length) {
                    EndDropBox = <div
                        data-key={count + 1}
                        onDrop={(e) => dropHandler(e, treeBlock)}
                        onDragLeave={(e) => dragEndHandler(e)}
                        onDragEnd={(e) => dragEndHandler(e)}
                        onDragOver={(e) => dragOverHandler(e)}
                        className="dropBox"/>
                }
                return <div key={treeBlock.id}>
                    <div
                        data-key={count}
                        onDrop={(e) => dropHandler(e, treeBlock)}
                        onDragLeave={(e) => dragEndHandler(e)}
                        onDragEnd={(e) => dragEndHandler(e)}
                        onDragOver={(e) => dragOverHandler(e)}
                        className="dropBox"/>
                    <div
                        onDragStart={(e) => dragStartHandler(e, treeBlock)}
                        draggable={true}
                        className="treeBlock">
                            {treeBlock.name} {treeBlock.order}
                    </div>
                    {EndDropBox}
                </div>
            })}
        </div>
    );
}

export default observer(App);
