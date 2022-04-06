import { Button } from '@gear-js/ui';
import AccountButton from 'shared/ui';
import { useAccount } from '../model';
import icon from './assets/user.svg';

type Props = {
  onClick: () => void;
};

function Account({ onClick }: Props) {
  const { account } = useAccount();

  return account ? (
    <AccountButton
      address={account.address}
      name={account.meta.name}
      onClick={onClick}
    />
  ) : (
    <Button icon={icon} text="Sign in" onClick={onClick} />
  );
}

export default Account;
