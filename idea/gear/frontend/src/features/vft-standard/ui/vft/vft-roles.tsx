import { HexString } from '@gear-js/api';
import { Identicon } from '@polkadot/react-identicon';

import { getShortName } from '@/shared/helpers';
import { Box } from '@/shared/ui';

import { useVftRoles } from '../../hooks';

import styles from './vft-roles.module.scss';

type Props = {
  id: HexString | undefined;
};

function VftRoles({ id }: Props) {
  const { admins, minters, burners } = useVftRoles(id);

  const renderRoles = (addresses: HexString[]) => {
    if (!addresses || addresses.length === 0) {
      return <li className={styles.emptyState}>No addresses</li>;
    }

    return addresses.map((address) => (
      <li key={address} className={styles.addressItem}>
        <Identicon value={address} theme="polkadot" size={16} className={styles.identicon} />

        <span className={styles.address}>{getShortName(address, 12)}</span>
      </li>
    ));
  };

  return (
    <div className={styles.container}>
      <Box className={styles.roleCard}>
        <h3 className={styles.roleTitle}>Admins</h3>
        <ul className={styles.addressList}>{renderRoles(admins.data || [])}</ul>
      </Box>

      <Box className={styles.roleCard}>
        <h3 className={styles.roleTitle}>Minters</h3>
        <ul className={styles.addressList}>{renderRoles(minters.data || [])}</ul>
      </Box>

      <Box className={styles.roleCard}>
        <h3 className={styles.roleTitle}>Burners</h3>
        <ul className={styles.addressList}>{renderRoles(burners.data || [])}</ul>
      </Box>
    </div>
  );
}

export { VftRoles };
