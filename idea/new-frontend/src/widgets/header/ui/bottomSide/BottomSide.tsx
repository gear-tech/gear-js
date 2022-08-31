import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';
import { Button, buttonStyles } from '@gear-js/ui';

import { useModal } from 'hooks';
import { getAnimationTimeout } from 'shared/helpers';
import uploadCodeSVG from 'shared/assets/images/actions/uploadCode.svg';
import uploadFileSVG from 'shared/assets/images/actions/uploadFile.svg';
import sendMessageSVG from 'shared/assets/images/actions/send.svg';

import styles from './BottomSide.module.scss';
import { CODE_MODAL_PROPS, PROGRAM_MODAL_PROPS } from '../../model/consts';

const BottomSide = () => {
  const { showModal } = useModal();

  const handleUploadCodeClick = () => showModal('uploadFile', CODE_MODAL_PROPS);
  const handleUploadProgramClick = () => showModal('uploadFile', PROGRAM_MODAL_PROPS);

  const linkClasses = clsx(buttonStyles.button, buttonStyles.secondary, buttonStyles.medium, styles.fixSize);

  return (
    <CSSTransition in appear timeout={getAnimationTimeout(1)}>
      <div className={styles.bottomSide}>
        <Button
          icon={uploadFileSVG}
          text="Upload program"
          className={styles.fixSize}
          onClick={handleUploadProgramClick}
        />
        <Button icon={uploadCodeSVG} text="Upload Code" className={styles.fixSize} onClick={handleUploadCodeClick} />
        <Link to="/" className={linkClasses} onClick={handleUploadCodeClick}>
          <img src={sendMessageSVG} alt="send" className={buttonStyles.icon} />
          Send Message
        </Link>
      </div>
    </CSSTransition>
  );
};

export { BottomSide };
