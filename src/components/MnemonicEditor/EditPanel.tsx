import React from "react";
import "../../styles/MnemonicPanel.css"
import mnemoNodeStore from "../../stores/mnemoNodeStore";

interface IEditPanel {

}

const EditPanel = (props: IEditPanel) => {
    const addNodeOnPanel = () => {
        mnemoNodeStore.addNode({
            id: 'rect' + (mnemoNodeStore.nodeList.length + 1).toString(),
            width: 100,
            height: 40,
            x: 300,
            y: 100,
            active: false
        });
    }
    const linkToNode = () => {
        const nodeInfo = mnemoNodeStore.nodeList.filter(node=> node.active);
        if (nodeInfo.length < 2) {
            return;
        }
        for (let itemIndex in nodeInfo) {
            if (+itemIndex > 0) {
                const findLine = mnemoNodeStore.lineList.find(
                    (line) => {
                        const findTarget = [nodeInfo[itemIndex].id, nodeInfo[+itemIndex - 1].id].indexOf(line.target.id);
                        const findSource = [nodeInfo[itemIndex].id, nodeInfo[+itemIndex - 1].id].indexOf(line.source.id);
                        return findSource !== -1 && findTarget !== -1;
                    })
                if (typeof findLine !== 'undefined') {
                    mnemoNodeStore.removeLine(findLine);
                } else {
                    mnemoNodeStore.addLine({
                        source: nodeInfo[+itemIndex - 1].id,
                        target: nodeInfo[itemIndex].id
                    });
                }
            }
        }
    }

    const groupNodes = () => {
        const nodeInfo = mnemoNodeStore.nodeList.filter(node=> node.active);
        console.log(nodeInfo);
    }
    return (
        <div className="mnemoEditPanel">
            <div className="mnemoEditPanelHeader">Панель редактирования</div>
            <button onClick={addNodeOnPanel}>Добавить Node</button>
            <button onClick={linkToNode}>Соединить объекты</button>
            <button onClick={groupNodes}>Сгруппировать</button>
        </div>
    )
}

export default EditPanel;