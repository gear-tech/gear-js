import { HexString } from '@vara-eth/api';

import EtherscanSvg from '@/assets/icons/etherscan.svg?react';

import { Tooltip } from '../tooltip';

import styles from './explorer-link.module.scss';

type Props = {
  path: string;
  id: HexString;
};

const ExplorerLink = ({ path, id }: Props) => {
  return (
    <Tooltip value="View on Etherscan">
      {/* TODO: support mainnet */}
      <a href={`https://hoodi.etherscan.io/${path}/${id}`} target="_blank" rel="noreferrer" className={styles.link}>
        <EtherscanSvg />
      </a>
    </Tooltip>
  );
};

export { ExplorerLink };
