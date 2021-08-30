import React from 'react';

import { EDITOR_DROPDOWN } from 'consts';

import './EditorMenu.scss';

type Props = {
    editorMenuRef: any, 
    handleTemplate: (index: number) => void;
}

const EditorMenu = ({ editorMenuRef, handleTemplate }: Props) => (
    <div className="editor-menu" ref={editorMenuRef}>
        {
            EDITOR_DROPDOWN.map((item, index) => (
                <button 
                    className="editor-menu__item"
                    onClick={() => handleTemplate(index)}
                    type="button"
                    key={item}
                >
                    { item }
                </button>
            ))
        }
    </div>
)

export { EditorMenu };