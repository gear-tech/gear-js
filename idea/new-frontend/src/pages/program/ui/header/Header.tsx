import clsx from 'clsx';
import { CSSTransition } from 'react-transition-group';
import { generatePath } from 'react-router-dom';

import { getShortName } from 'shared/helpers';
import { absoluteRoutes, AnimationTimeout, routes } from 'shared/config';
import { UILink } from 'shared/ui/uiLink';
import sendSVG from 'shared/assets/images/actions/send.svg';
import readSVG from 'shared/assets/images/actions/read.svg';

import styles from './Header.module.scss';

type Props = {
  name: string;
  programId: string;
  isLoading: boolean;
};

const Header = ({ name, programId, isLoading }: Props) => (
  <section className={clsx(styles.header, isLoading && styles.loading)}>
    {!isLoading && (
      <CSSTransition in appear timeout={AnimationTimeout.Default} mountOnEnter>
        <h1 className={styles.programName}>{getShortName(name, 36)}</h1>
      </CSSTransition>
    )}
    <div className={styles.links}>
      <UILink
        to={generatePath(absoluteRoutes.sendMessage, { programId })}
        icon={sendSVG}
        text="Send Message"
        color="secondary"
        className={styles.fixWidth}
      />
      <UILink
        to={generatePath(routes.state, { programId })}
        icon={readSVG}
        text="Read State"
        color="secondary"
        className={styles.fixWidth}
      />
    </div>
  </section>
);

export { Header };
