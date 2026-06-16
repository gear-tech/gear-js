import { useAppKit } from '@reown/appkit/react';
import { useConnection, useEnsName } from 'wagmi';

import { Button } from '@/components';
import { getTruncatedText } from '@/shared/utils';

import styles from './wallet-button.module.scss';

const WalletButton = () => {
  const { open } = useAppKit();

  const ethAccount = useConnection();
  const name = useEnsName({ address: ethAccount.address });
  const chainName = ethAccount.chain?.name;

  return (
    <Button onClick={() => open()} className={styles.button}>
      {ethAccount.address ? (
        <>
          {name.data || getTruncatedText(ethAccount.address)}
          <span className={styles.chain}>{chainName || 'Unknown network'}</span>
        </>
      ) : (
        'Connect Wallet'
      )}
    </Button>
  );
};

export { WalletButton };
