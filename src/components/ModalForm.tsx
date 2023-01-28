import React, {FC, ReactNode} from "react";
import {observer} from "mobx-react";

import '../styles/ModalForm.css';
import '../styles/EditBoardLineForm.css'

interface IModalForm {
    active: boolean;
    setModalFormActive: (boardLineId: boolean) => void;
    children?: ReactNode;
}

const ModalForm: FC<IModalForm> = (props) => {
    const closeModalForm = () => {
        props.setModalFormActive(false);
    }

    return (
        <div
            className={props.active ? "editBoardMain active" : "editBoardMain"}
            onClick={() => closeModalForm()}>
            <div
                className={props.active ? "editBoardForm active" : "editBoardForm"}
                onClick={e => e.stopPropagation()}
            >
                {props.children}
            </div>
        </div>
    )
}

export default observer(ModalForm);