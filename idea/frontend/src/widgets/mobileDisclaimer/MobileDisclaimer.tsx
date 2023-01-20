import { Button } from '@gear-js/ui';

import { useOutsideClick } from 'hooks';
import disclaimerImage from 'shared/assets/images/banners/mobileDisclaimer.png';
import { ReactComponent as CloseSVG } from 'shared/assets/images/actions/close.svg';

import styles from './MobileDisclaimer.module.scss';

type Props = {
  onCloseButtonClick: () => void;
};

// TODO: probably should be a @gear-js/ui modal? different layout and styles tho
const MobileDisclaimer = ({ onCloseButtonClick }: Props) => {
  const ref = useOutsideClick<HTMLDivElement>(onCloseButtonClick);

  return (
    <div className={styles.overlay}>
      <div ref={ref} className={styles.disclaimer}>
        <img src={disclaimerImage} alt="Desktop monitor and tablet" />

        <p>Thank you for visiting Gear Idea portal.</p>
        <p>For better experience it is recommended to use it on desktop/laptop devices.</p>

        <Button text="Close" icon={CloseSVG} color="light" onClick={onCloseButtonClick} />
      </div>
    </div>
  );
};

export { MobileDisclaimer };
