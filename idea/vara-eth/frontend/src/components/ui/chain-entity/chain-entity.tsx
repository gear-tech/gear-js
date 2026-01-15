import { HexString } from '@vara-eth/api';
import { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';

import ArrowLeftSVG from '@/assets/icons/arrow-square-left.svg?react';

import { Button } from '../button';
import { ExplorerLink } from '../explorer-link';
import { HashLink } from '../hash-link';

import styles from './chain-entity.module.scss';

const Header = ({ children }: PropsWithChildren) => {
  return <header className={styles.header}>{children}</header>;
};

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button variant="icon" onClick={() => navigate(-1)}>
      <ArrowLeftSVG />
    </Button>
  );
};

type TitleProps = {
  id: HexString;
  explorerLink?: boolean;
};

const Title = ({ id, explorerLink }: TitleProps) => {
  return (
    <h1 className={styles.title}>
      <HashLink hash={id} truncateSize="xxl" />
      {explorerLink && <ExplorerLink path="address" id={id} />}
    </h1>
  );
};

const Data = ({ children }: PropsWithChildren) => {
  return <div className={styles.data}>{children}</div>;
};

const Key = ({ children }: PropsWithChildren) => {
  return <h2 className={styles.key}>{children}</h2>;
};

type BlockProps = {
  number: string;
  date: string;
};

const Block = ({ number, date }: BlockProps) => {
  return (
    <div className={styles.block}>
      <div>
        #{number} <ExplorerLink path="block" id={number} />
      </div>

      <div>{new Date(date).toLocaleString()}</div>
    </div>
  );
};

const ChainEntity = {
  Header,
  BackButton,
  Title,
  Data,
  Key,
  Block,
};

export { ChainEntity };
