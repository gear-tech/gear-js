import { HexString } from '@gear-js/api';
import { useAccount, useProgramQuery } from '@gear-js/react-hooks';
import { ZERO_ADDRESS } from 'sails-js';

import { Box } from '@/shared/ui';

import { useAccountRole, useVftProgram } from '../../hooks';

import styles from './vft-account-overview.module.scss';

type Props = {
  id: HexString | undefined;
};

function VftAccountOverview({ id }: Props) {
  const { account } = useAccount();
  const { data: program } = useVftProgram(id);

  const balance = useProgramQuery({
    program,
    serviceName: 'vft',
    functionName: 'balanceOf',
    args: [account?.decodedAddress || ZERO_ADDRESS],
    query: { enabled: Boolean(account) },
  });

  const { isAdmin, isMinter, isBurner } = useAccountRole(id);

  const renderRoles = () => {
    const roles = [];

    if (isAdmin)
      roles.push(
        <span key="admin" className={styles.roleBadge}>
          Admin
        </span>,
      );
    if (isMinter)
      roles.push(
        <span key="minter" className={styles.roleBadge}>
          Minter
        </span>,
      );
    if (isBurner)
      roles.push(
        <span key="burner" className={styles.roleBadge}>
          Burner
        </span>,
      );

    return roles.length > 0 ? roles : <span className={styles.noRoles}>No roles</span>;
  };

  return (
    <Box className={styles.accountOverview}>
      <h3 className={styles.title}>Account Overview</h3>

      <div className={styles.info}>
        <div className={styles.infoItem}>
          <span className={styles.label}>Your Balance:</span>
          <span className={styles.value}>{balance.data || '0'}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>Your Roles:</span>
          <div className={styles.roles}>{renderRoles()}</div>
        </div>
      </div>
    </Box>
  );
}

export { VftAccountOverview };
