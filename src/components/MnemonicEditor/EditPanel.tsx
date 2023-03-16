import React from "react";
import "../../styles/MnemonicPanel.css"
import mnemoNodeStore from "../../stores/mnemoNodeStore";

interface IEditPanel {
    activeNode: Array<string>;
}
const EditPanel = (props: IEditPanel) => {
    const addNodeOnPanel = () => {
        mnemoNodeStore.addNode({
            id: 'rect' + (mnemoNodeStore.nodeList.length + 1).toString(),
                width: 50,
                height: 50,
                x: 300,
                y: 100,
                active: false
            });
    }
    const linkToNode = () => {
        if (props.activeNode.length < 2) return;
        for (let itemIndex in props.activeNode) {
            if (+itemIndex > 0) {
                const findLine = mnemoNodeStore.lineList.find(
                    (line) => {
                        const findTarget = [props.activeNode[itemIndex], props.activeNode[+itemIndex - 1]].indexOf(line.target.id);
                        const findSource = [props.activeNode[itemIndex], props.activeNode[+itemIndex - 1]].indexOf(line.source.id);
                        return findSource != -1 && findTarget != -1;
                    })
                if (typeof findLine !== 'undefined') {
                    mnemoNodeStore.removeLine(findLine);
                } else {
                    mnemoNodeStore.addLine({
                        source: props.activeNode[+itemIndex - 1],
                        target: props.activeNode[itemIndex]
                    });
                }
            }
        }
    }
    return (
        <div className="mnemoEditPanel">
            <div className="mnemoEditPanelHeader">Панель редактирования</div>
            <button onClick={addNodeOnPanel}>Добавить Node</button>
            <button onClick={linkToNode}>Соединить объекты</button>
        </div>
    )
}

export default EditPanel;