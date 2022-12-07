import { Socials } from './socials';
import { Copyright } from './copyright';
import styles from './Footer.module.scss';
import clsx from 'clsx'

function Footer() {
  return (
    <footer className={clsx('container', styles.footer)}>
      <Socials />
      <Copyright />
    </footer>
  );
}

export { Footer };
