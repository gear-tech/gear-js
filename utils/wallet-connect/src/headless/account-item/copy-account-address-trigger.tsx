import { useRender, mergeProps } from '@base-ui-components/react';
import { useCallback } from 'react';

import { copyToClipboard } from '@/utils';

import { useWalletContext } from '../root';

import { useAccountItemContext } from './context';

type Props = useRender.ComponentProps<'button'>;
type ElementProps = useRender.ElementProps<'button'>;

function CopyAccountAddressTrigger({ render, ...props }: Props) {
  const { dialog } = useWalletContext();
  const { account } = useAccountItemContext();

  const handleClick = useCallback(() => {
    copyToClipboard({
      value: account.address,

      onSuccess: () => {
        console.log('Copied');
        dialog.close();
      },

      onError: () => console.error('Copy error'),
    });
  }, [account.address, dialog]);

  const defaultProps: ElementProps = {
    type: 'button',
    onClick: handleClick,
  };

  return useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(defaultProps, props),
    render,
  });
}

export { CopyAccountAddressTrigger };
