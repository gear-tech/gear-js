import { Button } from '@gear-js/ui';
import useAccount from 'hooks';
import AccountButton from '../account-button';
import userIcon from './assets/user.svg';

type Props = {
  onClick: () => void;
};

function LoginButton({ onClick }: Props) {
  const { account } = useAccount();

  return account ? (
    <AccountButton address={account.address} name={account.meta.name} onClick={onClick} />
  ) : (
    <Button icon={userIcon} text="Sign in" onClick={onClick} />
  );
}

export default LoginButton;
