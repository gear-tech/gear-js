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
  value: string;
  date: string;
};

const BlockNumber = ({ value, date }: BlockProps) => {
  return (
    <div className={styles.block}>
      <div>
        #{value} <ExplorerLink path="block" id={value} />
      </div>

      <div>{new Date(date).toLocaleString()}</div>
    </div>
  );
};

type NotFoundProps = {
  entity: string;
  id: HexString;
};

const NotFound = ({ entity, id }: NotFoundProps) => {
  return (
    <div className={styles.notFound}>
      <h2>{entity} not found</h2>

      <p>
        The {entity} with ID <HashLink hash={id} /> does not exist.
      </p>
    </div>
  );
};

const ChainEntity = {
  Header,
  BackButton,
  Title,
  Data,
  Key,
  BlockNumber,
  NotFound,
};

export { ChainEntity };
