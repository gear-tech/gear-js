import { useAppKit } from '@reown/appkit/react';
import { useAccount, useEnsName } from 'wagmi';

import { Button } from '@/components';
import { getTruncatedText } from '@/shared/utils';

import styles from './wallet-button.module.scss';

const WalletButton = () => {
  const { open } = useAppKit();

  const ethAccount = useAccount();
  const name = useEnsName({ address: ethAccount.address });

  return (
    <Button onClick={() => open()} className={styles.button}>
      {ethAccount.address ? (
        <>
          {name.data || getTruncatedText(ethAccount.address)}
          <span className={styles.chain}>Hoodi</span>
        </>
      ) : (
        'Connect Wallet'
      )}
    </Button>
  );
};

export { WalletButton };
