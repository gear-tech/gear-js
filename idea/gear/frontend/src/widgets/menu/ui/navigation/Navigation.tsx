import CodesSVG from '@/shared/assets/images/menu/codes.svg?react';
import DnsSVG from '@/shared/assets/images/menu/dns.svg?react';
import ExplorerSVG from '@/shared/assets/images/menu/explorer.svg?react';
import MailboxSVG from '@/shared/assets/images/menu/mailbox.svg?react';
import ProgramsSVG from '@/shared/assets/images/menu/programs.svg?react';
import VouchersSVG from '@/shared/assets/images/menu/vouchers.svg?react';
import { routes } from '@/shared/config';
import { OnboardingTooltip } from '@/shared/ui/onboardingTooltip';

import { AppExamplesLink } from '../appExamplesLink';
import { NavigationItem } from '../navigationItem';

import styles from './Navigation.module.scss';

type Props = {
  isOpen: boolean;
};

const Navigation = ({ isOpen }: Props) => {
  return (
    <nav className={styles.navigation}>
      <NavigationItem to={routes.programs} icon={<ProgramsSVG />} text="Programs" isFullWidth={isOpen} />

      <OnboardingTooltip index={3}>
        <NavigationItem to={routes.codes} icon={<CodesSVG />} text="Codes" isFullWidth={isOpen} />
      </OnboardingTooltip>

      <OnboardingTooltip index={5}>
        <NavigationItem to={routes.explorer} icon={<ExplorerSVG />} text="Explorer" isFullWidth={isOpen} />
      </OnboardingTooltip>

      <OnboardingTooltip index={6}>
        <NavigationItem to={routes.mailbox} icon={<MailboxSVG />} text="Mailbox" isFullWidth={isOpen} />
      </OnboardingTooltip>

      <NavigationItem to={routes.vouchers} icon={<VouchersSVG />} text="Vouchers" isFullWidth={isOpen} />

      <NavigationItem to={routes.dns} icon={<DnsSVG />} text="dDNS" isFullWidth={isOpen} />

      <OnboardingTooltip index={7}>
        <AppExamplesLink isFullWidth={isOpen} />
      </OnboardingTooltip>
    </nav>
  );
};

export { Navigation };
