import React, {useState} from "react";
import ViewPanel from "./ViewPanel";
import EditPanel from "./EditPanel";

import '../../styles/MnemonicPanel.css';

const MnemonicEditor = () => {
    const [menuStyle, setMenyStyle] = useState('mnemoMain');
    const [panelStyle, setPanelStyle] = useState('mnemoPanel');
    const panelDown = () => {
        setMenyStyle(prevState => {
            if (prevState === 'mnemoMain') {
                return prevState + ' mnemoMainHalf';
            } else if (prevState === 'mnemoMain mnemoMainHalf') {
                return prevState + ' mnemoMainFull';
            }
            return prevState;

        });
        setPanelStyle(prevState => prevState === 'mnemoPanel' ? prevState + ' active' : prevState);
    }

    const panelUp = () => {
        setMenyStyle(prevState => {
            if (prevState === 'mnemoMain mnemoMainHalf mnemoMainFull') {
                return 'mnemoMain mnemoMainHalf'
            } else if (prevState === 'mnemoMain mnemoMainHalf') {
                return 'mnemoMain';
            }
            return prevState;
        });
        setPanelStyle(prevState => menuStyle === 'mnemoMain mnemoMainHalf' ? 'mnemoPanel' : prevState);
    }
    return (
        <div className={menuStyle}>
            <div className={panelStyle}>
                <EditPanel/>
                <ViewPanel/>
            </div>
            <div className="viewPanelDiv">
                <button className="viewPanelDown" onClick={panelDown}>Вниз</button>
                <button className="viewPanelUp" onClick={panelUp}>Вверх</button>
            </div>
        </div>
    )
}

export default MnemonicEditor;