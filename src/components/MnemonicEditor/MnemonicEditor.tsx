import React, {useState} from "react";
import ViewPanel from "./ViewPanel";
import EditPanel from "./EditPanel";

import '../../styles/MnemonicPanel.css';

const MnemonicEditor = () => {
    const [menuStyle, setMenyStyle] = useState('mnemoMain');
    const [panelStyle, setPanelStyle] = useState('mnemoPanel');
    const [activeNode, setActiveNode] = useState<Array<string>>([]);
    const panelDown = () => {
        setMenyStyle(prevState => (prevState === 'mnemoMain') ?
                'mnemoMain mnemoMainHalf' : 'mnemoMain mnemoMainHalf mnemoMainFull'
        );
        setPanelStyle(prevState => prevState === 'mnemoPanel' ? prevState + ' active' : prevState);
    }

    const panelUp = () => {
        setMenyStyle(prevState => (prevState === 'mnemoMain mnemoMainHalf mnemoMainFull') ?
                'mnemoMain mnemoMainHalf' : 'mnemoMain'
        );
        setPanelStyle(prevState => menuStyle === 'mnemoMain mnemoMainHalf' ? 'mnemoPanel' : prevState);
    }

    const editActiveNode = (newActiveNodes: string) => {
        const findIndex = activeNode.findIndex(item => item == newActiveNodes);
        if (findIndex == -1) {
            setActiveNode(prevState => [...prevState, newActiveNodes]);
        } else {
            activeNode.splice(findIndex, 1);
            setActiveNode(activeNode.splice(findIndex, 1));
        }
    }

    return (
        <div className={menuStyle}>
            <div className={panelStyle}>
                <EditPanel activeNode={activeNode}/>
                <ViewPanel activeNode={activeNode} setActiveNode={editActiveNode}/>
            </div>
            <div className="viewPanelDiv">
                <button className="viewPanelDown" onClick={panelDown}>Вниз</button>
                <button className="viewPanelUp" onClick={panelUp}>Вверх</button>
            </div>
        </div>
    )
}

export default MnemonicEditor;