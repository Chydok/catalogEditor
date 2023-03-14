import React from "react";
import "../../styles/MnemonicPanel.css"
import mnemoNodeStore from "../../stores/mnemoNodeStore";

const EditPanel = () => {
    const addNodeOnPanel = () => {
        mnemoNodeStore.addNode({id: 'test4', width: 50, height: 50, x: 300, y: 100})
    }
    return (
        <div className="mnemoEditPanel">
            <div className="mnemoEditPanelHeader">Панель редактирования</div>
            <button onClick={addNodeOnPanel}>Добавить Node</button>
        </div>
    )
}

export default EditPanel;