import React, { useState, useEffect, VFC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { RootState } from 'store/reducers';
import { routes } from 'routes';
import { LogoIcon } from 'assets/Icons';
import NotificationsIcon from 'assets/images/notifications.svg';
import CodeIllustration from 'assets/images/code.svg';
import { WASM_COMPILER_GET } from 'consts';
import { EventTypes } from 'types/events';
import { Wallet } from '../Wallet';
import { setIsBuildDone, AddAlert } from '../../../store/actions/actions';
import './Header.scss';
import Sidebar from './Sidebar/Sidebar';

export const Header: VFC = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const isNotifications = location.pathname === routes.notifications;

  const chainName = localStorage.chain ? localStorage.chain : 'Loading ...';

  const { isApiReady } = useSelector((state: RootState) => state.api);
  const { countUnread } = useSelector((state: RootState) => state.notifications);
  let { isBuildDone } = useSelector((state: RootState) => state.compiler);

  if (localStorage.getItem('programCompileId') && !isBuildDone) {
    isBuildDone = true;
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const headerIconsColor = '#fff';

  useEffect(() => {
    let timerId: any;

    if (isBuildDone) {
      const id = localStorage.getItem('programCompileId');

      timerId = setInterval(() => {
        fetch(WASM_COMPILER_GET, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({ id }),
        })
          .then((data) => data.json())
          .then((json) => {
            const zip = new JSZip();

            zip.loadAsync(json.file.data).then((data) => {
              data.generateAsync({ type: 'blob' }).then((val) => {
                saveAs(val, `program.zip`);
                dispatch(setIsBuildDone(false));
                localStorage.removeItem('programCompileId');
                clearInterval(timerId);
                dispatch(AddAlert({ type: EventTypes.SUCCESS, message: `Program is ready!` }));
              });
            });
          })
          .catch((err) => console.error(err));
      }, 20000);
    }

    return () => {
      clearInterval(timerId);
    };
  }, [dispatch, isBuildDone]);

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <header className="header">
      <div className="header__logo-and-button">
        <Link to={routes.main} className="header__logo">
          <LogoIcon color={headerIconsColor} />
        </Link>
        <button type="button" onClick={openSidebar} className="add_node">
          Change node
        </button>
        <div className="headder__chain-block">
          <p className="headder__chain-text">{!isApiReady ? 'Loading ...' : chainName}</p>
        </div>
      </div>
      <div className="header__right-block">
        <Link to={routes.editor} className="header__right-block_ide">
          IDE
        </Link>
        <div className="header__user-block user-block">
          <Wallet />
        </div>
        <div className="header--actions-wrapper">
          <Link to={isNotifications ? routes.main : routes.notifications} className="header__notifications">
            <img src={isNotifications ? CodeIllustration : NotificationsIcon} alt="notifications" />
            {(countUnread && !isNotifications && (
              <div className="indicator">
                <div className="notifications-count mobile" />
              </div>
            )) ||
              null}
          </Link>
        </div>
      </div>
      {isSidebarOpen && <Sidebar closeSidebar={closeSidebar} />}
    </header>
  );
};
