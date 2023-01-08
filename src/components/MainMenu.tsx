import React from 'react';
import {observer} from "mobx-react";

function MainMenu () {
    return (
        <div className="mainMenu">
            <div>
                <button>Назад</button>
                <button>Вперёд</button>
            </div>
            <div>
                <button>Сохранить</button>
                <button>Отменить</button>
            </div>
        </div>
    );
}

export default observer(MainMenu);