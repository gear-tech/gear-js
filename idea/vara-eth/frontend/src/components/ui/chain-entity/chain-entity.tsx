import { HexString } from '@vara-eth/api';
import { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';

import ArrowLeftSVG from '@/assets/icons/arrow-square-left.svg?react';
import { PropsWithClassName } from '@/shared/types';

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

const Value = ({ children, className }: PropsWithClassName & PropsWithChildren) => {
  return <div className={className}>{children}</div>;
};

type BlockProps = {
  number: string;
  date: string;
};

const Block = ({ number, date }: BlockProps) => {
  return (
    <ChainEntity.Value className={styles.block}>
      <div>
        #{number} <ExplorerLink path="block" id={number} />
      </div>

      <div>{new Date(date).toLocaleString()}</div>
    </ChainEntity.Value>
  );
};

const ChainEntity = {
  Header,
  BackButton,
  Title,
  Data,
  Key,
  Value,
  Block,
};

export { ChainEntity };
