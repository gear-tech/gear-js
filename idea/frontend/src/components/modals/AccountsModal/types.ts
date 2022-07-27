import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

import { ModalProps } from 'context/modal/types';

export type AccountsModalProps = ModalProps & {
  accounts?: InjectedAccountWithMeta[];
};
