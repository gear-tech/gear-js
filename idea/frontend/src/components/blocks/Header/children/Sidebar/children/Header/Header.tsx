import { useSearchParams } from 'react-router-dom';
import { Button } from '@gear-js/ui';

import styles from './Header.module.scss';

import { LOCAL_STORAGE, NODE_ADRESS_URL_PARAM } from 'consts';
import { NODE_API_ADDRESS } from 'context/api/const';
import crossSVG from 'assets/images/close.svg';
import refreshSVG from 'assets/images/refresh.svg';

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
    // remove param to update it during nodeApi init
    removeNodeFromUrl();
    localStorage.setItem(LOCAL_STORAGE.NODE_ADDRESS, selectedNode);
    window.location.reload();
  };

  return (
    <header className={styles.header}>
      <Button
        text="Switch"
        size="small"
        icon={refreshSVG}
        onClick={switchNode}
        disabled={selectedNode === NODE_API_ADDRESS}
      />
      <Button aria-label="Close sidebar" icon={crossSVG} color="transparent" onClick={closeSidebar} />
    </header>
  );
};

export { Header };
