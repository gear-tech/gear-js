import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';
import { Button, buttonStyles } from '@gear-js/ui';

import { getAnimationTimeout } from 'shared/helpers';
import uploadCodeSVG from 'shared/assets/images/actions/uploadCode.svg';
import sendMessageSVG from 'shared/assets/images/actions/send.svg';
import uploadProgramSVG from 'shared/assets/images/actions/uploadProgram.svg';

import styles from './BottomSide.module.scss';

const BottomSide = () => {
  const linkClasses = clsx(buttonStyles.button, buttonStyles.secondary, buttonStyles.medium, styles.fixSize);

  return (
    <CSSTransition in appear timeout={getAnimationTimeout(1)}>
      <div className={styles.bottomSide}>
        <Button icon={uploadProgramSVG} text="Upload program" className={styles.fixSize} />
        <Button icon={uploadCodeSVG} text="Upload Code" className={styles.fixSize} />
        <Link to="/" className={linkClasses}>
          <img src={sendMessageSVG} alt="send" className={buttonStyles.icon} />
          Send Message
        </Link>
      </div>
    </CSSTransition>
  );
};

export { BottomSide };
