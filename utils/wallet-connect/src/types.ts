import { FunctionComponent, SVGProps } from 'react';

import { WALLET } from './consts';

type SVGComponent = FunctionComponent<
  SVGProps<SVGSVGElement> & { title?: string; titleId?: string; desc?: string; descId?: string }
>;

type WalletValue = {
  name: string;
  SVG: SVGComponent;
};

type WalletId = keyof typeof WALLET;

type Wallets = [WalletId, WalletValue][];

export type { SVGComponent, WalletValue, WalletId, Wallets };
