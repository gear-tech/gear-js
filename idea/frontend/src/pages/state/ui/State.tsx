import clsx from 'clsx';
import { Outlet } from 'react-router-dom';

import { useStateType } from '../hooks';
import styles from './State.module.scss';

const State = () => {
  const { isWasmState } = useStateType();
  const className = clsx(isWasmState && styles.wrapper);

  return (
    <div className={className}>
      <h2 className={styles.heading}>Read Program State</h2>
      <Outlet />
    </div>
  );
};

export { State };
