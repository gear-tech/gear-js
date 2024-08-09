import { HexString } from '@gear-js/api';
import { getVaraAddress } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';
import Identicon from '@polkadot/react-identicon';

import TrashSVG from '@/shared/assets/images/actions/trashOutlined.svg?react';
import CopySVG from '@/shared/assets/images/actions/copyGreen.svg?react';

import styles from './admin-card.module.scss';

type Props = {
  index: number;
  address: HexString;
};

function AdminCard({ index, address }: Props) {
  const getDoubleDigit = (num: number) => (num < 10 ? `0${num}` : num);

  return (
    <div className={styles.card}>
      <div className={styles.summary}>
        <div className={styles.count}>{getDoubleDigit(index + 1)}</div>

        <div className={styles.address}>
          <Identicon size={16} theme="polkadot" value={address} />
          {getVaraAddress(address)}
          <Button icon={CopySVG} color="transparent" />
        </div>
      </div>

      <Button icon={TrashSVG} color="transparent" />
    </div>
  );
}

export { AdminCard };
