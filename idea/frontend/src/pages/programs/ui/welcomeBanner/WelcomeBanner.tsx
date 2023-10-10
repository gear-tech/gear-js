import clsx from 'clsx';
import { Button } from '@gear-js/ui';

import { ExamplesLink } from '@/shared/ui/examplesLink';
import gear1PNG from '@/shared/assets/images/banners/gear1.png';
import gear2PNG from '@/shared/assets/images/banners/gear2.png';
import gear3PNG from '@/shared/assets/images/banners/gear3.png';
import closeSVG from '@/shared/assets/images/actions/close.svg?react';

import styles from './WelcomeBanner.module.scss';

type Props = {
  onClose: () => void;
  className?: string;
};

const WelcomeBanner = ({ className, onClose }: Props) => (
  <article className={clsx(styles.welcomeBanner, className)}>
    <div className={styles.content}>
      <h2 className={styles.title}>Welcome to Gear IDEA</h2>
      <p className={styles.description}>
        This is the demo application that implements all of the possibilities of interaction with smart-contracts in
        Gear, that also manages accounts, balances, events and more.
      </p>
      <p className={styles.description}>
        You can start experimenting right now or try to build from examples. Let`s Rock!
      </p>
      <ExamplesLink />
    </div>
    <div className={styles.banner}>
      <img src={gear1PNG} alt="gear1" className={styles.gear1} />
      <img src={gear2PNG} alt="gear2" className={styles.gear2} />
      <img src={gear3PNG} alt="gear3" className={styles.gear3} />
    </div>
    <Button icon={closeSVG} color="transparent" className={styles.closeBtn} onClick={onClose} />
  </article>
);

export { WelcomeBanner };
