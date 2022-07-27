import { useAccount } from '@gear-js/react-hooks';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

function OnLogin({ children, fallback }: Props) {
  const { account } = useAccount();

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{account ? children : fallback}</>;
}

export { OnLogin };
