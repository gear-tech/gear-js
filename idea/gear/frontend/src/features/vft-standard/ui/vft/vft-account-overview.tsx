import { HexString } from '@gear-js/api';
import { useAccount, useProgramQuery } from '@gear-js/react-hooks';

import { Box } from '@/shared/ui';

import { useAccountRole, useVftProgram } from '../../hooks';

import styles from './vft-account-overview.tsx.module.scss';

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
    args: [account!.decodedAddress],
    query: { enabled: Boolean(account) },
  });

  const { isAdmin, isMinter, isBurner } = useAccountRole(id);

  const renderRoles = () => {
    const roles = [];

    if (isAdmin) roles.push('Admin');
    if (isMinter) roles.push('Minter');
    if (isBurner) roles.push('Burner');

    return roles.join(', ');
  };

  return (
    <Box>
      <h2>VFT Account Overview</h2>

      <div>
        <div>
          <span>Balance:</span>
          <span>{balance.data}</span>
        </div>

        <div>
          <span>Roles:</span>
          <span>{renderRoles()}</span>
        </div>
      </div>
    </Box>
  );
}

export { VftAccountOverview };
