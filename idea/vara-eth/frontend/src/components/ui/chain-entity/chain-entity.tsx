import { HexString } from '@vara-eth/api';
import { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';

import ArrowLeftSVG from '@/assets/icons/arrow-square-left.svg?react';
import EtherscanSvg from '@/assets/icons/etherscan.svg?react';
import { PropsWithClassName } from '@/shared/types';

import { Button } from '../button';
import { HashLink } from '../hash-link';
import { Tooltip } from '../tooltip';

import styles from './chain-entity.module.scss';

type ExplorerLinkProps = {
  path: string;
  id: string;
};

const ExplorerLink = ({ path, id }: ExplorerLinkProps) => {
  return (
    <Tooltip value="View on Etherscan">
      {/* TODO: support mainnet */}
      <a href={`https://hoodi.etherscan.io/${path}/${id}`} target="_blank" rel="noreferrer" className={styles.link}>
        <EtherscanSvg />
      </a>
    </Tooltip>
  );
};

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

type HashProps = {
  value: HexString;
  linkTo?: string;
  truncateSize?: 'xxl';
  explorerLinkPath?: 'address' | 'tx';
};

const Hash = ({ value, linkTo, truncateSize, explorerLinkPath }: HashProps) => {
  return (
    <ChainEntity.Value className={styles.hash}>
      <HashLink hash={value} href={linkTo} truncateSize={truncateSize} />
      {explorerLinkPath && <ExplorerLink path={explorerLinkPath} id={value} />}
    </ChainEntity.Value>
  );
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
  Hash,
  Block,
};

export { ChainEntity };
