import { HexString } from '@vara-eth/api';
import { useParams } from 'react-router-dom';
import { useBalance } from 'wagmi';

import { useWrappedVaraBalance } from '@/app/api';
import { Balance, ExplorerLink, HashLink, Navigation } from '@/components';
import { Search } from '@/features/search';
import { formatBalance } from '@/shared/utils';

import styles from './user.module.scss';

type Params = {
  userId: HexString;
};

export const User = () => {
  const { userId } = useParams() as Params;

  const address = userId.startsWith('0x') ? userId : undefined;

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
              <ExplorerLink path="address" id={userId} />
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
