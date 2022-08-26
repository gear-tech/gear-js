import { DotButton } from './dotButton/DotButton';
import { Socials } from './socials/Socials';
import styles from './Footer.module.scss';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Socials />
      <small className={styles.copyright}>{year}. All rights reserved.</small>
      <DotButton />
    </footer>
  );
};

export { Footer };
