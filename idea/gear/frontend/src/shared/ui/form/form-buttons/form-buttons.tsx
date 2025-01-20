import { Button } from '@gear-js/ui';

import ApplySVG from '@/shared/assets/images/actions/apply.svg?react';
import CloseSVG from '@/shared/assets/images/actions/close.svg?react';

import styles from './form-buttons.module.scss';

type Props = {
  disabled?: boolean;
  onCloseClick: () => void;
};

function FormButtons({ disabled, onCloseClick }: Props) {
  return (
    <div className={styles.container}>
      <Button type="submit" icon={ApplySVG} text="Submit" size="large" disabled={disabled} />
      <Button icon={CloseSVG} text="Cancel" size="large" color="light" onClick={onCloseClick} />
    </div>
  );
}

export { FormButtons };
