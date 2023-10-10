import { Input, Button } from '@gear-js/ui';
import { isHex } from '@polkadot/util';
import { HexString } from '@polkadot/util/types';
import { useState } from 'react';

import ApplySVG from 'shared/assets/images/actions/apply.svg?react';

import styles from './MetadataInput.module.scss';

type Props = {
  onSubmit: (value: HexString) => void;
};

const MetadataInput = ({ onSubmit }: Props) => {
  const [value, setValue] = useState('');

  const handleSubmit = () => onSubmit(isHex(value) ? value : `0x${value}`);

  return (
    // not using form cuz MetadataInput is part of another form in the UploadMetadataModal
    <div className={styles.form}>
      <Input
        label="Metadata in hex format:"
        direction="y"
        placeholder="0x00"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      />

      <Button text="Apply" color="secondary" icon={ApplySVG} onClick={handleSubmit} />
    </div>
  );
};

export { MetadataInput };
