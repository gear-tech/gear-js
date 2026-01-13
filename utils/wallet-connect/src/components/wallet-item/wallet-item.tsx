import { useRender } from '@base-ui-components/react';

type Props = useRender.ComponentProps<'li'>;

function WalletItem({ render, ...props }: Props) {
  return useRender({
    defaultTagName: 'li',
    render,
    props,
  });
}

export { WalletItem };
