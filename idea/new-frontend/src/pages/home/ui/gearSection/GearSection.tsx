import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { CSSTransition } from 'react-transition-group';
import { useAlert, useApi } from '@gear-js/react-hooks';

import { LocalStorage, AnimationTimeout } from 'shared/config';
import { ReactComponent as AppSVG } from 'shared/assets/images/indicators/app.svg';
import { ReactComponent as PulseSVG } from 'shared/assets/images/indicators/pulse.svg';
import { ReactComponent as GlobusSVG } from 'shared/assets/images/indicators/globus.svg';

import styles from './GearSection.module.scss';
import { WelcomeBanner } from '../welcomeBanner';
import { GearIndicator } from '../gearIndicator';

type Props = {
  isLoggedIn: boolean;
};

const GearSection = ({ isLoggedIn }: Props) => {
  const { api } = useApi();
  const alert = useAlert();

  const isVisible = !(isLoggedIn || Boolean(localStorage.getItem(LocalStorage.HideWelcomeBanner)));

  const [programsCount, setProgramsCount] = useState<number | null>(null);
  const [isBannerVisible, setIsBannerVisible] = useState(isVisible);

  const closeBanner = () => {
    setIsBannerVisible(false);
    localStorage.setItem(LocalStorage.HideWelcomeBanner, 'true');
  };

  useEffect(() => {
    api.program
      .allUploadedPrograms()
      .then((programs) => setProgramsCount(programs.length))
      .catch((error) => alert.error(error.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api]);

  useEffect(() => {
    setIsBannerVisible(isVisible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  const isLoading = programsCount === null;

  return (
    <CSSTransition in={isBannerVisible} timeout={AnimationTimeout.Default}>
      <section className={clsx(styles.gearSection, isBannerVisible && styles.withBanner)}>
        <CSSTransition in={isBannerVisible} timeout={AnimationTimeout.Default} unmountOnExit>
          <WelcomeBanner className={styles.welcomeBanner} onClose={closeBanner} />
        </CSSTransition>
        <div className={styles.indicators}>
          <GearIndicator icon={<AppSVG />} name="App Examples" value="31" isLoading={isLoading} />
          <GearIndicator
            icon={<PulseSVG />}
            name="Active Programs Count"
            value={String(programsCount)}
            isLoading={isLoading}
          />
          <GearIndicator icon={<GlobusSVG />} name="Nodes Count" value="1032" isLoading={isLoading} />
        </div>
      </section>
    </CSSTransition>
  );
};

export { GearSection };
