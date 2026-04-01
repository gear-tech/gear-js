import { useAppKit } from '@reown/appkit/react';
import type { ComponentProps } from 'react';
import { useAccount } from 'wagmi';

import { Button } from '../button';

// omit type because there's no way to capture submit
function ActionButton({ onClick, ...props }: Omit<ComponentProps<typeof Button>, 'type'>) {
  const account = useAccount();
  const { open } = useAppKit();

  return <Button onClick={account.address ? onClick : () => open()} {...props} />;
}

export { ActionButton };
