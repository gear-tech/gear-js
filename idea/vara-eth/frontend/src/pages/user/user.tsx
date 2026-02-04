import { HexString } from '@vara-eth/api';
import { useParams } from 'react-router-dom';
import { formatEther, formatUnits, isAddress } from 'viem';
import { useBalance } from 'wagmi';

import { useWrappedVaraBalance } from '@/app/api';
import { Balance, ChainEntity } from '@/components';

import styles from './user.module.scss';

type Params = {
  userId: HexString;
};

export const User = () => {
  const { userId } = useParams() as Params;
  const address = isAddress(userId) ? userId : undefined;

  const { data: ethBalance } = useBalance({ address });
  const { value, decimals } = useWrappedVaraBalance(address);

  const wvara = value !== undefined && decimals ? formatUnits(value, decimals) : null;
  const eth = ethBalance ? formatEther(ethBalance.value) : null;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <ChainEntity.Header>
          <h2 className={styles.title}>Address</h2>
          <ChainEntity.Title id={userId} explorerLink />
        </ChainEntity.Header>

        <ChainEntity.Data>
          <ChainEntity.Key>Balance</ChainEntity.Key>

          <div>
            {wvara && <Balance value={wvara} units="WVARA" />} | {eth && <Balance value={eth} units="ETH" />}
          </div>
        </ChainEntity.Data>
      </div>
    </div>
  );
};
