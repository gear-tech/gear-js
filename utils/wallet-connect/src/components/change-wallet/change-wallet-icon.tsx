import { useRender } from '@base-ui-components/react';

import { SVGComponent } from '@/types';

import { useDialogContext } from '../dialog';

type Props = useRender.ComponentProps<SVGComponent>;

function ChangeWalletIcon({ render, ...props }: Props) {
  const { wallet } = useDialogContext();
  const { SVG } = wallet || {};

  return useRender({
    render: render ?? (SVG && <SVG />),
    enabled: Boolean(wallet),
    props,
  });
}

export { ChangeWalletIcon };
