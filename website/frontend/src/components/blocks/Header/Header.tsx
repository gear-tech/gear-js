import React, { useState, useEffect, VFC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { RootState } from 'store/reducers';
import { WASM_COMPILER_GET } from 'consts';
import { EventTypes } from 'types/events';
import { Wallet } from '../Wallet';
import { setIsBuildDone, AddAlert } from '../../../store/actions/actions';
import { Logo } from './children/Logo/Logo';
import { Menu } from './children/Menu/Menu';
import { Sidebar } from './children/Sidebar/Sidebar';
import styles from './Header.module.scss';

export const Header: VFC = () => {
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  let { isBuildDone } = useSelector((state: RootState) => state.compiler);
  if (localStorage.getItem('programCompileId') && !isBuildDone) {
    isBuildDone = true;
  }

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
      <nav className={styles.nav}>
        <Logo />
        <Menu openSidebar={openSidebar} />
      </nav>
      <Wallet />
      {isSidebarOpen && <Sidebar closeSidebar={closeSidebar} />}
    </header>
  );
};
