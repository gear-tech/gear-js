import { Button as GearButton, Modal as GearModal } from '@gear-js/ui';
import { Button as VaraButton, Modal as VaraModal } from '@gear-js/vara-ui';

import CopySVG from '@/assets/copy.svg?react';
import ExitSVG from '@/assets/exit.svg?react';

import { GearButton as ExtendedGearButton } from './gear-button';
import { HTMLProps } from './types';

const UI_CONFIG = {
  vara: {
    TriggerConnect: <VaraButton text="" />,
    TriggerConnected: <VaraButton text="" color="contrast" />,

    AccountTrigger: ({ color: _color, children, ...props }: HTMLProps, { isActive }: { isActive: boolean }) => (
      <VaraButton color={isActive ? 'primary' : 'plain'} size="small" block {...props}>
        {children}
      </VaraButton>
    ),

    // eslint-disable-next-line react/no-children-prop
    CopyAccountAddressTrigger: <VaraButton children={undefined} icon={CopySVG} size="medium" color="transparent" />,

    ChangeWalletTrigger: <VaraButton text="" color="transparent" />,
    LogoutTrigger: <VaraButton size="medium" icon={ExitSVG} color="transparent" />,

    WalletTrigger: <VaraButton text="" color="plain" size="small" block />,

    Dialog: VaraModal,
  },

  gear: {
    TriggerConnect: <ExtendedGearButton text="" />,
    TriggerConnected: <ExtendedGearButton text="" color="light" />,

    AccountTrigger: ({ color: _color, ...props }: HTMLProps, { isActive }: { isActive: boolean }) => (
      <ExtendedGearButton color={isActive ? 'primary' : 'light'} size="large" block {...props} />
    ),

    CopyAccountAddressTrigger: <GearButton icon={CopySVG} color="transparent" />,

    ChangeWalletTrigger: <ExtendedGearButton color="transparent" />,
    LogoutTrigger: <GearButton text="Logout" icon={ExitSVG} color="transparent" />,

    WalletTrigger: <ExtendedGearButton size="large" color="light" block />,

    Dialog: GearModal,
  },
};

export { UI_CONFIG };
