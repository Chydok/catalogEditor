import React, {useState} from 'react';
import './App.css';
import {treeBlockStore} from "./stores/treeBlockStore";

function App() {
    const [treeBlockList, setTreeBlockList] = useState([
        {id: 1, order: 3, text: 'Блок'},
        {id: 2, order: 1, text: 'Блок'},
        {id: 3, order: 2, text: 'Блок'},
        {id: 4, order: 4, text: 'Блок'},
    ]);
    const [currentTreeBlock, setCurrentTreeBlock] = useState<treeBlockStore>();
    function dragStartHandler (e: React.DragEvent<HTMLDivElement>, treeBlock: treeBlockStore) {
        // @ts-ignore
        setCurrentTreeBlock(treeBlock);
    }
    function dragEndHandler (e: React.DragEvent<HTMLDivElement>) {
        // @ts-ignore
        e.target.style.background = 'white';
    }

    function dragOverHandler(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        // @ts-ignore
        e.target.style.background = 'lightgray';
    }

    function dropHandler(e: React.DragEvent<HTMLDivElement>, treeBlock: treeBlockStore) {
        setTreeBlockList(treeBlockList.map(block => {
            if (block.id === treeBlock.id) {
                return {...block, order: currentTreeBlock!.order};
            }
            if (block.id === currentTreeBlock!.id) {
                return {...block, order: treeBlock.order};
            }
            return block;
        }))
        // @ts-ignore
        e.target.style.background = 'white';
    }

    function clickHandler(e: React.MouseEvent<HTMLDivElement>, treeBlock: treeBlockStore) {
        // @ts-ignore
    }

    return (
        <div className="app">
            <div className="addTreeBlock">+</div>
            {treeBlockList.map(treeBlock =>
                <div
                    key = {treeBlock.id}
                    onDragStart={(e) => dragStartHandler(e, treeBlock)}
                    onDragLeave={(e) => dragEndHandler(e)}
                    onDragEnd={(e) => dragEndHandler(e)}
                    onDragOver={(e) => dragOverHandler(e)}
                    onDrop={(e) => dropHandler(e, treeBlock)}
                    onClick={(e) => clickHandler(e, treeBlock)}
                    draggable={true}
                    className="treeBlock">
                        {treeBlock.text} {treeBlock.order}
                </div>
            )}
        </div>
    );
}

export default App;
