import clsx from 'clsx';
import { Radio } from '@gear-js/ui';

import styles from './MetaSwitch.module.scss';

type Props = {
  className?: string;
  isMetaFromFile: boolean;
  onChange: (value: boolean) => void;
};

const MetaSwitch = (props: Props) => {
  const { className, isMetaFromFile, onChange } = props;

  const handleUploadClick = () => onChange(true);
  const handleManualClick = () => onChange(false);

  return (
    <div className={clsx(styles.switch, className)}>
      <label className={styles.caption}>Metadata: </label>
      <div className={styles.block}>
        <Radio
          name="upload"
          label="Upload file"
          checked={isMetaFromFile}
          className={styles.radioBtn}
          onChange={handleUploadClick}
        />
        <Radio
          name="manual"
          label="Manual input"
          checked={!isMetaFromFile}
          className={styles.radioBtn}
          onChange={handleManualClick}
        />
      </div>
    </div>
  );
};

export { MetaSwitch };
