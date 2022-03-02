import React from 'react';
import { useSearchParams } from 'react-router-dom';
import refresh from 'assets/images/refresh2.svg';
import cross from 'assets/images/close.svg';
import { nodeApi } from 'api/initApi';
import { LOCAL_STORAGE, NODE_ADRESS_URL_PARAM } from 'consts';
import { Button } from 'common/components/Button/Button';
import styles from './Header.module.scss';

type Props = {
  closeSidebar: () => void;
  selectedNode: string;
};

const Header = ({ closeSidebar, selectedNode }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const removeNodeFromUrl = () => {
    searchParams.delete(NODE_ADRESS_URL_PARAM);
    // push instead of replace to preserve previous node param history
    setSearchParams(searchParams);
  };

  const switchNode = () => {
    if (selectedNode !== nodeApi.address) {
      // remove param to update it during nodeApi init
      removeNodeFromUrl();
      localStorage.setItem(LOCAL_STORAGE.NODE_ADDRESS, selectedNode);
      window.location.reload();
    }
  };

  return (
    <header className={styles.header}>
      <Button text="Switch" size="small" icon={refresh} onClick={switchNode} />
      <Button icon={cross} onClick={closeSidebar} />
    </header>
  );
};

export { Header };
