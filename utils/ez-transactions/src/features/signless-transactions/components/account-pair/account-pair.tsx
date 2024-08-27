import { KeyringPair, KeyringPair$Json } from '@polkadot/keyring/types';
import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/vara-ui';
import { ReactComponent as CopySVG } from '@/assets/icons/file-copy-fill.svg';
import { copyToClipboard, getVaraAddress, shortenString } from '../../utils';
import styles from './account-pair.module.css';

type Props = {
  pair: KeyringPair | KeyringPair$Json;
};

function AccountPair({ pair }: Props) {
  const alert = useAlert();

  return (
    <span className={styles.accountWrapper}>
      <span className={styles.account}>{shortenString(getVaraAddress(pair.address), 4)}</span>
      <Button
        icon={CopySVG}
        color="transparent"
        className={styles.copy}
        onClick={() => copyToClipboard({ value: getVaraAddress(pair.address), alert })}
      />
    </span>
  );
}

export { AccountPair };
