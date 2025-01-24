import { useAccount } from '@gear-js/react-hooks';
import { FunctionComponent } from 'react';

function withAccount<T>(Component: FunctionComponent<T>) {
  return (props: T & JSX.IntrinsicAttributes) => {
    const { account } = useAccount();

    return account ? <Component {...props} /> : null;
  };
}

export { withAccount };
