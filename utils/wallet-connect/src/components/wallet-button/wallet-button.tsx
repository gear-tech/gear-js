import { FunctionComponent, ReactNode, SVGProps } from 'react';

import styles from './wallet-button.module.scss';

type WalletButtonProps = {
  children: ReactNode;
  disabled: boolean;
  onClick: () => void;
};

type WalletProps = {
  SVG: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;
  name: string;
};

function Wallet({ SVG, name }: WalletProps) {
  return (
    <span className={styles.wallet}>
      <SVG className={styles.icon} />
      {name}
    </span>
  );
}

export { type WalletButtonProps, type WalletProps, Wallet };
