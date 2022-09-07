import { getShortName } from 'shared/helpers';
import { UILink } from 'shared/ui/uiLink';
import sendSVG from 'shared/assets/images/actions/send.svg';
import readSVG from 'shared/assets/images/actions/read.svg';

import styles from './Header.module.scss';

type Props = {
  name: string;
};

const Header = ({ name }: Props) => (
  <section id="test-header" className={styles.header}>
    <h1 className={styles.programName}>{getShortName(name, 36)}</h1>
    <div className={styles.links}>
      <UILink to="/" icon={sendSVG} text="Send Message" color="secondary" />
      <UILink to="/" icon={readSVG} text="Read State" color="light" />
    </div>
  </section>
);

export { Header };
