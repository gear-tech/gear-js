import { useRender, mergeProps } from '@base-ui-components/react';

import { copyToClipboard } from '@/utils';

import { useWalletContext } from '../root';

import { useAccountItemContext } from './context';

type Props = useRender.ComponentProps<'button'> & {
  onCopy?: () => void;
};

type ElementProps = useRender.ElementProps<'button'>;

function CopyAccountAddressTrigger({ render, onCopy, ...props }: Props) {
  const { dialog } = useWalletContext();
  const { account } = useAccountItemContext();

  const handleClick = () =>
    copyToClipboard({
      value: account.address,

      onSuccess: () => {
        onCopy?.();
        dialog.close();
      },

      onError: (error) => console.error('Copy error', error),
    });

  const defaultProps: ElementProps = {
    type: 'button',
    children: 'Copy',
    onClick: handleClick,
  };

  return useRender({
    defaultTagName: 'button',
    props: mergeProps<'button'>(defaultProps, props),
    render,
  });
}

export { CopyAccountAddressTrigger };
