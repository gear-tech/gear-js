import { FunctionComponent, SVGProps } from 'react';
import { WALLET } from './consts';

export type WalletValue = {
  name: string;
  SVG: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;
};

type WalletId = keyof typeof WALLET;

type Wallets = [WalletId, WalletValue][];

export type { WalletId, Wallets };
