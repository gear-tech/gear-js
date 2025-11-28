import { HexString } from '@gear-js/api';
import { useAccount, useProgram, useProgramQuery } from '@gear-js/react-hooks';

import { SailsProgram } from './sails';

function useVftProgram(id: HexString | undefined) {
  return useProgram({ id, library: SailsProgram });
}

function useVftDecimals(id: HexString | undefined) {
  const { data: program } = useVftProgram(id);

  return useProgramQuery({ program, serviceName: 'vft', functionName: 'decimals', args: [] });
}

function useVftRoles(id: HexString | undefined) {
  const { data: program } = useVftProgram(id);

  const admins = useProgramQuery({ program, serviceName: 'vft', functionName: 'admins', args: [] });
  const minters = useProgramQuery({ program, serviceName: 'vft', functionName: 'minters', args: [] });
  const burners = useProgramQuery({ program, serviceName: 'vft', functionName: 'burners', args: [] });

  return { admins, minters, burners };
}

function useAccountRole(id: HexString | undefined) {
  const { account } = useAccount();
  const { admins, minters, burners } = useVftRoles(id);

  const isAdmin = account ? admins.data?.includes(account.decodedAddress) : false;
  const isMinter = account ? minters.data?.includes(account.decodedAddress) : false;
  const isBurner = account ? burners.data?.includes(account.decodedAddress) : false;

  return { isAdmin, isMinter, isBurner };
}

export { useVftProgram, useVftDecimals, useVftRoles, useAccountRole };
