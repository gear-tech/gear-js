import { Button } from '@gear-js/ui';

import { useModal } from 'hooks';
import uploadCodeSVG from 'shared/assets/images/actions/uploadCode.svg';
import uploadFileSVG from 'shared/assets/images/actions/uploadFile.svg';
import sendMessageSVG from 'shared/assets/images/actions/send.svg';

import { CODE_MODAL_PROPS, PROGRAM_MODAL_PROPS } from '../../model/consts';
import styles from './BottomSide.module.scss';

const BottomSide = () => {
  const { showModal } = useModal();

  const handleUploadCodeClick = () => showModal('uploadFile', CODE_MODAL_PROPS);
  const handleUploadProgramClick = () => showModal('uploadFile', PROGRAM_MODAL_PROPS);
  const handleSendMessageClick = () => showModal('message');

  return (
    <div className={styles.bottomSide}>
      <Button
        icon={uploadFileSVG}
        text="Upload program"
        className={styles.fixSize}
        onClick={handleUploadProgramClick}
      />
      <Button icon={uploadCodeSVG} text="Upload Code" className={styles.fixSize} onClick={handleUploadCodeClick} />
      <Button
        icon={sendMessageSVG}
        text="Send Message"
        color="secondary"
        className={styles.fixSize}
        onClick={handleSendMessageClick}
      />
    </div>
  );
};

export { BottomSide };
