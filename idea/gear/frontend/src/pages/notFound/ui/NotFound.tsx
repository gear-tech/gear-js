import { buttonStyles } from '@gear-js/ui';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

import notFoundImg from '@/shared/assets/images/placeholders/404.png';
import { routes } from '@/shared/config';

import styles from './NotFound.module.scss';

const NotFound = () => {
  const styleAmount = { '--stacks': 3 } as React.CSSProperties;
  const styleIndex1 = { '--index': 0 } as React.CSSProperties;
  const styleIndex2 = { '--index': 1 } as React.CSSProperties;
  const styleIndex3 = { '--index': 2 } as React.CSSProperties;

  const homeLinkClasses = clsx(buttonStyles.button, buttonStyles.large, buttonStyles.light, styles.link);

  return (
    <div className={styles.notFound}>
      <div className={styles.container}>
        <figure>
          <img className={styles.img} src={notFoundImg} alt="Page not found" />
          <img className={styles.img} src={notFoundImg} alt="Page not found" />
          <img className={styles.img} src={notFoundImg} alt="Page not found" />
        </figure>
        <div className={styles.block}>
          <div className={styles.stack} style={styleAmount}>
            <h3 className={styles.heading} style={styleIndex1}>
              Something went wrong
            </h3>
            <h3 className={styles.heading} style={styleIndex2}>
              Something went wrong
            </h3>
            <h3 className={styles.heading} style={styleIndex3}>
              Something went wrong
            </h3>
          </div>
          <div className={styles.stack} style={styleAmount}>
            <p className={styles.paragraph} style={styleIndex1}>
              Ooops! Page not found.
            </p>
            <p className={styles.paragraph} style={styleIndex2}>
              Ooops! Page not found.
            </p>
            <p className={styles.paragraph} style={styleIndex3}>
              Ooops! Page not found.
            </p>
          </div>
          <Link to={routes.home} className={homeLinkClasses}>
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export { NotFound };
