import { Button } from '@gear-js/ui';
import { useNavigate } from 'react-router-dom';

import { useCodeUpload, useModal } from 'hooks';
import { ReactComponent as uploadCodeSVG } from 'shared/assets/images/actions/uploadCode.svg';
import { ReactComponent as uploadFileSVG } from 'shared/assets/images/actions/uploadFile.svg';
import { ReactComponent as sendMessageSVG } from 'shared/assets/images/actions/send.svg';
import { absoluteRoutes } from 'shared/config';

import styles from './BottomSide.module.scss';

const BottomSide = () => {
  const navigate = useNavigate();

  const { showModal } = useModal();
  const uploadCode = useCodeUpload();

  const onProgramUpload = (file: File) => navigate(absoluteRoutes.uploadProgram, { state: { file } });
  const onCodeUpload = (file: File) => uploadCode({ file });

  const handleUploadCodeClick = () => showModal('uploadFile', { name: 'code', onUpload: onCodeUpload });
  const handleUploadProgramClick = () => showModal('uploadFile', { name: 'program', onUpload: onProgramUpload });
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
