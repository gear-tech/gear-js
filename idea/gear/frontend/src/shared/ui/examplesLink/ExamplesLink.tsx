import { buttonStyles } from '@gear-js/ui';
import clsx from 'clsx';

import ExternalResourceSVG from '../../assets/images/actions/externalResource.svg?react';
import AppSVG from '../../assets/images/indicators/app.svg?react';
import { EXAMPLES_HREF } from '../../config';

import styles from './ExamplesLink.module.scss';

const ExamplesLink = () => {
  const linkClasses = clsx(buttonStyles.button, buttonStyles.medium, buttonStyles.light, styles.link);

  return (
    <a rel="noreferrer" href={EXAMPLES_HREF} target="_blank" className={linkClasses}>
      <AppSVG className={buttonStyles.icon} />
      <span className={styles.text}>App Examples</span>
      <ExternalResourceSVG className={buttonStyles.icon} />
    </a>
  );
};

export { ExamplesLink };
