import { DotButton } from './dotButton/DotButton';
import { Copyright } from './copyright/Copyright';
import { Socials } from './socials/Socials';
import styles from './Footer.module.scss';

const Footer = () => (
  <footer className={styles.footer}>
    <Socials />
    <Copyright />
    <DotButton />
  </footer>
);

export { Footer };
