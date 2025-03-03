import { useAccount } from '@gear-js/react-hooks';
import { FunctionComponent, JSX } from 'react';

function withAccount<T>(Component: FunctionComponent<T>) {
  // eslint-disable-next-line react/display-name -- TODO(#1800): resolve eslint comments
  return (props: T & JSX.IntrinsicAttributes) => {
    const { account } = useAccount();

    return account ? <Component {...props} /> : null;
  };
}

export { withAccount };
