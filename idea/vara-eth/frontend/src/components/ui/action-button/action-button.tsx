import { useAppKit } from '@reown/appkit/react';
import { ComponentProps } from 'react';
import { useAccount } from 'wagmi';

import { Button } from '../button';

function ActionButton({ onClick, ...props }: ComponentProps<typeof Button>) {
  const account = useAccount();
  const { open } = useAppKit();

  return <Button onClick={account.address ? onClick : () => open()} {...props} />;
}

export { ActionButton };
