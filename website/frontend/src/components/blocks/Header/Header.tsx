import React, { useState, useEffect, VFC } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { RootState } from 'store/reducers';
import { routes } from 'routes';
import { LogoIcon } from 'assets/Icons';
import Bell from 'assets/images/bell.svg';
import { WASM_COMPILER_GET } from 'consts';
import { EventTypes } from 'types/events';
import { Wallet } from '../Wallet';
import { setIsBuildDone, AddAlert } from '../../../store/actions/actions';
import Sidebar from './Sidebar/Sidebar';
import styles from './Header.module.scss';

export const Header: VFC = () => {
  const dispatch = useDispatch();
  const chainName = localStorage.chain || 'Loading...';

  const { isApiReady } = useSelector((state: RootState) => state.api);
  const { countUnread } = useSelector((state: RootState) => state.notifications);
  const isAnyNotification = Number(countUnread) > 0;

  let { isBuildDone } = useSelector((state: RootState) => state.compiler);

  if (localStorage.getItem('programCompileId') && !isBuildDone) {
    isBuildDone = true;
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <header className={styles.header}>
      <nav className={styles.section}>
        <Link to={routes.main} className={`${styles.logo} ${styles.imgWrapper}`}>
          <LogoIcon color="#fff" />
        </Link>
        <ul className={styles.menu}>
          <li className={styles.menuItem} onClick={openSidebar}>
            {!isApiReady ? 'Loading...' : chainName}
          </li>
          <li className={styles.menuItem}>
            <Link to={routes.editor} className={styles.link}>
              &lt;/&gt; IDE
            </Link>
          </li>
        </ul>
      </nav>
      <div className={styles.section}>
        <Link to={routes.notifications} className={`${styles.notifications} ${styles.imgWrapper}`}>
          {isAnyNotification && <div className={styles.counter}>{countUnread}</div>}
          <img src={Bell} alt="notifications" className={styles.bell} />
        </Link>
        <Wallet />
      </div>
      {isSidebarOpen && <Sidebar closeSidebar={closeSidebar} />}
    </header>
  );
};
