import React from 'react';
import pageNotFoundImg from 'assets/images/404.png';
import { Main } from 'common/components/Main/Main';
import styles from './PageNotFound.module.scss';

export const PageNotFound = () => {
  const styleAmount = { '--stacks': 3 } as React.CSSProperties;
  const styleIndex1 = { '--index': 0 } as React.CSSProperties;
  const styleIndex2 = { '--index': 1 } as React.CSSProperties;
  const styleIndex3 = { '--index': 2 } as React.CSSProperties;

  return (
    <Main color="#282828">
      <div className={styles.PageNotFound}>
        <div className={styles.container}>
          <figure>
            <img className={styles.img} src={pageNotFoundImg} />
            <img className={styles.img} src={pageNotFoundImg} />
            <img className={styles.img} src={pageNotFoundImg} />
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
            <a className={styles.link} href="/">
              Back to homepage
            </a>
          </div>
        </div>
      </div>
    </Main>
  );
};
