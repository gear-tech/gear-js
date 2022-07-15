import { Socials } from './socials';
import { Copyright } from './copyright';
import styles from './Footer.module.scss';

function Footer() {
  return (
    <footer className={styles.footer}>
      <Socials />
      <Copyright />
    </footer>
  );
}

export { Footer };
