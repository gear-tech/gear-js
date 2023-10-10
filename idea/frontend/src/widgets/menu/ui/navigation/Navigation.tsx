import { routes } from 'shared/config';
import CodesSVG from 'shared/assets/images/menu/codes.svg?react';
import MailboxSVG from 'shared/assets/images/menu/mailbox.svg?react';
import ProgramsSVG from 'shared/assets/images/menu/programs.svg?react';
import MessagesSVG from 'shared/assets/images/menu/messages.svg?react';
import ExplorerSVG from 'shared/assets/images/menu/explorer.svg?react';

import { OnboardingTooltip } from 'shared/ui/onboardingTooltip';
import styles from './Navigation.module.scss';
import { NavigationItem } from '../navigationItem';
import { AppExamplesLink } from '../appExamplesLink';

type Props = {
  isOpen: boolean;
};

const Navigation = ({ isOpen }: Props) => (
  <nav className={styles.navigation}>
    <NavigationItem to={routes.programs} icon={<ProgramsSVG />} text="Programs" isFullWidth={isOpen} />

    <OnboardingTooltip index={3}>
      <NavigationItem to={routes.codes} icon={<CodesSVG />} text="Codes" isFullWidth={isOpen} />
    </OnboardingTooltip>

    <OnboardingTooltip index={5}>
      <NavigationItem to={routes.messages} icon={<MessagesSVG />} text="Messages" isFullWidth={isOpen} />
    </OnboardingTooltip>

    <OnboardingTooltip index={6}>
      <NavigationItem to={routes.explorer} icon={<ExplorerSVG />} text="Explorer" isFullWidth={isOpen} />
    </OnboardingTooltip>

    <OnboardingTooltip index={7}>
      <NavigationItem to={routes.mailbox} icon={<MailboxSVG />} text="Mailbox" isFullWidth={isOpen} />
    </OnboardingTooltip>

    <OnboardingTooltip index={8}>
      <AppExamplesLink isFullWidth={isOpen} />
    </OnboardingTooltip>
  </nav>
);

export { Navigation };
