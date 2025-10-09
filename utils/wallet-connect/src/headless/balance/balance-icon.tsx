import { useRender } from '@base-ui-components/react';

import VaraSVG from '@/assets/vara.svg?react';

type Props = useRender.ComponentProps<typeof VaraSVG>;

function BalanceIcon({ render, ...props }: Props) {
  return useRender({
    render: render ?? <VaraSVG />,
    props,
  });
}

export { BalanceIcon };
