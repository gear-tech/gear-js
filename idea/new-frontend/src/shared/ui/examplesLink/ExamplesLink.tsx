import clsx from 'clsx';
import { buttonStyles } from '@gear-js/ui';

import styles from './ExamplesLink.module.scss';
import { EXAMPLES_HREF } from '../../config';
import appSVG from '../../assets/images/indicators/app.svg';
import externalResourceSVG from '../../assets/images/actions/externalResource.svg';

const ExamplesLink = () => {
  const linkClasses = clsx(buttonStyles.button, buttonStyles.medium, buttonStyles.light, styles.link);

  return (
    <a rel="noreferrer" href={EXAMPLES_HREF} target="_blank" className={linkClasses}>
      <img src={appSVG} alt="app" className={buttonStyles.icon} />
      <span className={styles.text}>App Examples</span>
      <img src={externalResourceSVG} alt="external resource" className={buttonStyles.icon} />
    </a>
  );
};

export { ExamplesLink };
