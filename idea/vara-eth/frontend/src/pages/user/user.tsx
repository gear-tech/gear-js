import { useParams } from 'react-router-dom';
import { formatEther, formatUnits, isAddress, Hex } from 'viem';
import { useBalance } from 'wagmi';

import { useWrappedVaraBalance } from '@/app/api';
import { Balance, ChainEntity, Skeleton } from '@/components';
import { isUndefined } from '@/shared/utils';

import styles from './user.module.scss';

type Params = {
  userId: Hex;
};

export const User = () => {
  const { userId } = useParams() as Params;
  const address = isAddress(userId) ? userId : undefined;

  const { data: ethBalance, isPending: isEthPending } = useBalance({ address });
  const { value, decimals, isPending: isWvaraPending } = useWrappedVaraBalance(address);

  if (isEthPending || isWvaraPending)
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <ChainEntity.Header>
            <h2 className={styles.title}>Address</h2>
            <ChainEntity.Title id={userId} explorerLink />
          </ChainEntity.Header>

          <ChainEntity.Data>
            <ChainEntity.Key>Balance</ChainEntity.Key>
            <Skeleton width="16rem" />
          </ChainEntity.Data>
        </div>
      </div>
    );

  if (isUndefined(value) || isUndefined(decimals) || !ethBalance)
    return <ChainEntity.NotFound entity="user" id={userId} />;

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
            <Balance value={formatUnits(value, decimals)} units="WVARA" /> |{' '}
            <Balance value={formatEther(ethBalance.value)} units="ETH" />
          </div>
        </ChainEntity.Data>
      </div>
    </div>
  );
};
