import { useParams } from 'react-router-dom';
import { useBalance } from 'wagmi';

import { useWrappedVaraBalance } from '@/app/api';
import EtherscanSvg from '@/assets/icons/etherscan.svg?react';
import { Balance, HashLink, Navigation, Tooltip } from '@/components';
import { Search } from '@/features/search';
import { formatBalance } from '@/shared/utils';

import styles from './user.module.scss';

type Params = {
  userId: string;
};

export const User = () => {
  const { userId } = useParams() as Params;

  const address = userId.startsWith('0x') ? (userId as `0x${string}`) : undefined;

  const { data: ethBalance } = useBalance({ address });
  const { value, decimals } = useWrappedVaraBalance(address);

  const wvara = value !== undefined && decimals ? formatBalance(value, decimals) : null;
  const eth = ethBalance ? formatBalance(ethBalance.value, ethBalance.decimals) : null;

  return (
    <>
      <Navigation search={<Search />} />
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.leftSide}>
              <HashLink hash={userId} />
              <Tooltip value="View on Etherscan">
                {/* TODO: support mainnet */}
                <a
                  href={`https://holesky.etherscan.io/address/${userId}`}
                  target={'_blank'}
                  rel={'noreferrer'}
                  className={styles.link}>
                  <EtherscanSvg />
                </a>
              </Tooltip>
            </div>
          </div>

          <div className={styles.properties}>
            <div>BALANCE</div>
            {wvara && <Balance value={wvara} units="VWARA" />}
            {eth && <Balance value={eth} units="ETH" />}
          </div>
        </div>
      </div>
    </>
  );
};
