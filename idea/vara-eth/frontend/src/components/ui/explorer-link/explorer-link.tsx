import EtherscanSvg from '@/assets/icons/etherscan.svg?react';
import { PropsWithClassName } from '@/shared/types';
import { cx } from '@/shared/utils';

import { Tooltip } from '../tooltip';

import styles from './explorer-link.module.scss';

type Props = PropsWithClassName & {
  path: 'address' | 'tx' | 'block';
  id: string;
};

const ExplorerLink = ({ path, id, className }: Props) => {
  return (
    <Tooltip value="View on Etherscan">
      <a
        href={`https://hoodi.etherscan.io/${path}/${id}`}
        target="_blank"
        rel="noreferrer"
        className={cx(styles.link, className)}>
        <EtherscanSvg />
      </a>
    </Tooltip>
  );
};

export { ExplorerLink };
