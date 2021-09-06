import React from 'react';
import { useRouteMatch } from 'react-router-dom';

import { routes } from 'routes';

import { EDITOR_DROPDOWN, SEARCH_DROPDOWN } from 'fixtures';

import './DropdownMenu.scss';

type Props = {
    dropdownMenuRef: any, 
    handleDropdownBtnClick: (index: number) => void;
    handleCloseDropdown?: () => void;
}

const DropdownMenu = ({ dropdownMenuRef, handleDropdownBtnClick, handleCloseDropdown }: Props) => {

    const isNotificationsPage = useRouteMatch(routes.notifications);

    const dropdownMenuBtns = isNotificationsPage ? SEARCH_DROPDOWN : EDITOR_DROPDOWN;

    return (
        <div className="dropdown-menu" ref={dropdownMenuRef}>
            {
                dropdownMenuBtns.map((item, index) => (
                    <button 
                        className="dropdown-menu__item"
                        onClick={() => {
                            handleDropdownBtnClick(index);
                            if (typeof handleCloseDropdown === "function") {
                                handleCloseDropdown();
                            }
                        }}
                        type="button"
                        key={item}
                    >
                        { item }
                    </button>
                ))
            }
        </div>
    )
}

DropdownMenu.defaultProps = {
    handleCloseDropdown: undefined
}

export { DropdownMenu };