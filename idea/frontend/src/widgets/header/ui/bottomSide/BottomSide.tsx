import { Button } from '@gear-js/ui';
import { useNavigate } from 'react-router-dom';

import { useModal } from '@/hooks';
import uploadCodeSVG from '@/shared/assets/images/actions/uploadCode.svg?react';
import uploadFileSVG from '@/shared/assets/images/actions/uploadFile.svg?react';
import sendMessageSVG from '@/shared/assets/images/actions/send.svg?react';
import { OnboardingTooltip } from '@/shared/ui/onboardingTooltip';
import { absoluteRoutes, routes } from '@/shared/config';

import styles from './BottomSide.module.scss';

const BottomSide = () => {
  const navigate = useNavigate();

  const { showModal } = useModal();

  const onProgramUpload = (file: File) => navigate(absoluteRoutes.uploadProgram, { state: { file } });
  const onCodeUpload = (file: File) => navigate(routes.uploadCode, { state: { file } });

  const handleUploadCodeClick = () => showModal('uploadFile', { name: 'code', onUpload: onCodeUpload });
  const handleUploadProgramClick = () => showModal('uploadFile', { name: 'program', onUpload: onProgramUpload });
  const handleSendMessageClick = () => showModal('message');

  return (
    <div className={styles.bottomSide}>
      <OnboardingTooltip index={1}>
        <Button
          icon={uploadFileSVG}
          text="Upload program"
          className={styles.fixSize}
          onClick={handleUploadProgramClick}
        />
      </OnboardingTooltip>

      <OnboardingTooltip index={2}>
        <Button icon={uploadCodeSVG} text="Upload Code" className={styles.fixSize} onClick={handleUploadCodeClick} />
      </OnboardingTooltip>

      <OnboardingTooltip index={4}>
        <Button
          icon={sendMessageSVG}
          text="Send Message"
          color="secondary"
          className={styles.fixSize}
          onClick={handleSendMessageClick}
        />
      </OnboardingTooltip>
    </div>
  );
};

export { BottomSide };
