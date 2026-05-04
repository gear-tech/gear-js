import { useAtomValue } from 'jotai';

import { nodeAtom } from '@/app/store';
import EtherscanSvg from '@/assets/icons/etherscan.svg?react';
import { getEtherscanBaseUrl } from '@/shared/config';
import type { PropsWithClassName } from '@/shared/types';
import { cx } from '@/shared/utils';

import { Tooltip } from '../tooltip';

import styles from './explorer-link.module.scss';

type Props = PropsWithClassName & {
  path: 'address' | 'tx' | 'block';
  id: string;
};

const ExplorerLink = ({ path, id, className }: Props) => {
  const { ethChainId } = useAtomValue(nodeAtom);
  const etherscanBaseUrl = getEtherscanBaseUrl(ethChainId);

  return (
    <Tooltip value="View on Etherscan">
      <a
        href={`${etherscanBaseUrl}/${path}/${id}`}
        target="_blank"
        rel="noreferrer"
        className={cx(styles.link, className)}>
        <EtherscanSvg />
      </a>
    </Tooltip>
  );
};

export { ExplorerLink };
