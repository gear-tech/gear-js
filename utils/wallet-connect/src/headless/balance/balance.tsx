import { mergeProps, useRender } from '@base-ui-components/react';
import { useApi, useAccount, useBalanceFormat, useDeriveBalancesAll } from '@gear-js/react-hooks';
import { useMemo } from 'react';

import { BalanceProvider, useBalanceContext } from './context';

type BalanceProps = useRender.ComponentProps<'div'>;

type BalanceElementProps = useRender.ElementProps<'div'>;

type BalanceValueProps = useRender.ComponentProps<'span'>;

type BalanceSymbolProps = useRender.ComponentProps<'span'>;

function Balance({ render, ...props }: BalanceProps) {
  const { isApiReady } = useApi();
  const { account } = useAccount();
  const { getFormattedBalance } = useBalanceFormat();

  const { data } = useDeriveBalancesAll({
    address: account?.decodedAddress,
    watch: true,
    query: { select: (value) => value.transferable || value.availableBalance },
  });

  const { value, unit } = useMemo(() => {
    if (!isApiReady || data === undefined) {
      return { value: '', unit: '' };
    }

    return getFormattedBalance(data);
  }, [data, getFormattedBalance, isApiReady]);

  const contextValue = useMemo(() => ({ value, unit }), [value, unit]);

  const defaultProps: BalanceElementProps = {
    children: props.children,
  };

  const element = useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>(defaultProps, props),
  });

  return <BalanceProvider value={contextValue}>{element}</BalanceProvider>;
}

function BalanceValue({ render, ...props }: BalanceValueProps) {
  const { value } = useBalanceContext();

  const defaultProps: useRender.ElementProps<'span'> = {
    children: value,
  };

  return useRender({
    defaultTagName: 'span',
    render,
    props: mergeProps<'span'>(defaultProps, props),
  });
}

function BalanceSymbol({ render, ...props }: BalanceSymbolProps) {
  const { unit } = useBalanceContext();

  const defaultProps: useRender.ElementProps<'span'> = {
    children: unit,
  };

  return useRender({
    defaultTagName: 'span',
    render,
    props: mergeProps<'span'>(defaultProps, props),
  });
}

export { Balance, BalanceSymbol, BalanceValue };
