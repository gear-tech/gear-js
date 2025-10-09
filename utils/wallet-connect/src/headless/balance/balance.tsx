import { useRender } from '@base-ui-components/react';
import { useAccount, useBalanceFormat, useDeriveBalancesAll } from '@gear-js/react-hooks';

import { BalanceProvider } from './context';

type Props = useRender.ComponentProps<'div'>;

function Balance({ render, ...props }: Props) {
  const { account } = useAccount();
  const { getFormattedBalance } = useBalanceFormat();

  const { data } = useDeriveBalancesAll({
    address: account?.decodedAddress,
    watch: true,
    query: { select: (value) => getFormattedBalance(value.transferable || value.availableBalance) },
  });

  const element = useRender({
    defaultTagName: 'div',
    render,
    props,
  });

  return <BalanceProvider value={data || { value: '', unit: '' }}>{element}</BalanceProvider>;
}

export { Balance };
