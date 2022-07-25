import { DotButton } from './children/DotButton/DotButton';
import { Copyright } from './children/Copyright/Copyright';
import { Socials } from './children/Socials/Socials';
import styles from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <DotButton />
      <Copyright />
      <Socials />
    </footer>
  );
};

export { Footer };
