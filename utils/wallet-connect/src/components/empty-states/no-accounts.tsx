import { useRender, mergeProps } from '@base-ui-components/react';

import { useDialogContext } from '../dialog';

type Props = useRender.ComponentProps<'p'>;
type ElementProps = useRender.ElementProps<'p'>;

function NoAccounts({ render, ...props }: Props) {
  const { walletAccounts } = useDialogContext();

  const defaultProps: ElementProps = {
    children: 'No accounts found. Please open your extension and create a new account or import existing.',
  };

  return useRender({
    defaultTagName: 'p',
    enabled: walletAccounts?.length === 0,
    props: mergeProps<'p'>(defaultProps, props),
    render,
  });
}

export { NoAccounts };
