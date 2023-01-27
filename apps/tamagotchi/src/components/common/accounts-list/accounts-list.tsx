import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { decodeAddress } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { useAccount, useAlert } from '@gear-js/react-hooks';
import { AccountButton } from 'components/common/account-button';
import { Icon } from 'components/ui/icon';
import { LOCAL_STORAGE } from 'app/consts';
import { copyToClipboard, isLoggedIn } from 'app/utils';
import { useLesson } from 'app/context';

type Props = {
  list: InjectedAccountWithMeta[];
  onChange: () => void;
};

export const AccountsList = ({ list, onChange }: Props) => {
  const { logout, login } = useAccount();
  const alert = useAlert();
  const { reset } = useLesson();

  const handleAccountButtonClick = async (account: InjectedAccountWithMeta) => {
    await logout();
    await login(account);
    localStorage.setItem(LOCAL_STORAGE.ACCOUNT, account.address);
    onChange();
    reset();
  };

  const handleCopy = (address: string) => {
    const decodedAddress = decodeAddress(address);
    copyToClipboard(decodedAddress, alert);
  };

  return list.length > 0 ? (
    <ul className="space-y-4">
      {list.map((account) => (
        <li key={account.address} className="flex items-center gap-2">
          <AccountButton
            address={account.address}
            name={account.meta.name}
            isActive={isLoggedIn(account)}
            onClick={() => handleAccountButtonClick(account)}
          />
          <Button
            icon={() => <Icon name="copy" className="w-5 h-5" />}
            color="transparent"
            onClick={() => handleCopy(account.address)}
          />
        </li>
      ))}
    </ul>
  ) : (
    <p>
      No accounts found. Please open Polkadot extension, create a new account or import existing one and reload the
      page.
    </p>
  );
};
