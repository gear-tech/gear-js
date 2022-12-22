import { Input, Button } from '@gear-js/ui';
import { Hex } from '@gear-js/api';
import { useForm } from '@mantine/form';

import { ReactComponent as ApplySVG } from 'shared/assets/images/actions/apply.svg';
import { isHexValid } from 'shared/helpers';

import styles from './MetadataInput.module.scss';

type Props = {
  onSubmit: (value: Hex) => void;
};

const initialValues = { metaHex: '' as Hex };
const validate = { metaHex: isHexValid };

const MetadataInput = ({ onSubmit }: Props) => {
  const form = useForm({ initialValues, validate });
  const { getInputProps } = form;

  const handleSubmit = form.onSubmit(({ metaHex }) => onSubmit(metaHex));

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input label="Metadata in hex format:" direction="y" placeholder="0x00" {...getInputProps('metaHex')} />
      <Button type="submit" text="Apply" color="secondary" icon={ApplySVG} />
    </form>
  );
};

export { MetadataInput };
