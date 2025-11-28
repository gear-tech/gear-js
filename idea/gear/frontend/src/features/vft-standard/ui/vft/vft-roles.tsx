import { HexString } from '@gear-js/api';

import { getShortName } from '@/shared/helpers';
import { Box } from '@/shared/ui';

import { useVftRoles } from '../../hooks';

import styles from './vft-roles.module.scss';

type Props = {
  id: HexString | undefined;
};

function VftRoles({ id }: Props) {
  const { admins, minters, burners } = useVftRoles(id);

  const renderRoles = (addresses: HexString[]) =>
    addresses.map((address) => (
      <li key={address}>
        <span>{getShortName(address)}</span>
      </li>
    ));

  return (
    <div>
      <h2>VFT Roles</h2>

      <div className={styles.rolesContainer}>
        <Box>
          <span>Admins:</span>
          <ul>{renderRoles(admins.data || [])}</ul>
        </Box>

        <Box>
          <span>Minters:</span>
          <ul>{renderRoles(minters.data || [])}</ul>
        </Box>

        <Box>
          <span>Burners:</span>
          <ul>{renderRoles(burners.data || [])}</ul>
        </Box>
      </div>
    </div>
  );
}

export { VftRoles };
