import { Button } from '@gear-js/ui';
import { Ref } from 'react';

import { useModal } from '@/hooks';
import sendMessageSVG from '@/shared/assets/images/actions/send.svg?react';
import uploadCodeSVG from '@/shared/assets/images/actions/uploadCode.svg?react';
import uploadFileSVG from '@/shared/assets/images/actions/uploadFile.svg?react';
import { OnboardingTooltip } from '@/shared/ui/onboardingTooltip';

import styles from './BottomSide.module.scss';

type Props = {
  ref?: Ref<HTMLDivElement>; // TODO(#1780): temporary react 19 patch
};

const BottomSide = ({ ref }: Props) => {
  const { showModal } = useModal();

  const handleUploadCodeClick = () => showModal('uploadFile', { name: 'code' });
  const handleUploadProgramClick = () => showModal('uploadFile', { name: 'program' });
  const handleSendMessageClick = () => showModal('message');

  return (
    <div className={styles.bottomSide} ref={ref}>
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

      {/* commented out till next release */}
      {/* <VerifyLink className={clsx(styles.fixSize, styles.verifyCode)} /> */}
    </div>
  );
};

export { BottomSide };
