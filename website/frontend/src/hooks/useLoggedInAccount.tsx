import { useEffect } from 'react';
// eslint-disable-next-line import/no-cycle
import { useAccount, useApi } from '.';
import { isLoggedIn } from 'utils';
import { useAccounts } from 'components/blocks/Wallet/hooks';

function useLoggedInAccount() {
  const { api } = useApi();
  const { switchAccount } = useAccount();
  const accounts = useAccounts();

  useEffect(() => {
    const loggedInAccount = accounts?.find(isLoggedIn);
    if (loggedInAccount) {
      switchAccount(loggedInAccount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, accounts]);
}

export { useLoggedInAccount };
