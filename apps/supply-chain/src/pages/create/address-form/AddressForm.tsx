import { Hex } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { useForm } from '@mantine/form';
import clsx from 'clsx';
import { Box, Input } from 'components';
import { isValidHex } from 'utils';
import commonStyles from '../Create.module.scss';
import styles from './AddressForm.module.scss';

type Props = {
  id: string;
  onSubmit: (value: { nftProgramId: Hex; ftProgramId: Hex }) => void;
};

const initialValues = { ftProgramId: '' as Hex, nftProgramId: '' as Hex };
const validate = { ftProgramId: isValidHex, nftProgramId: isValidHex };

function AddressForm({ id, onSubmit }: Props) {
  const { api } = useApi();

  const form = useForm({ initialValues, validate });
  const { getInputProps, setFieldError } = form;

  const nftInputClassName = clsx(commonStyles.input, styles.nftInput);

  const handleSubmit = form.onSubmit(async ({ nftProgramId, ftProgramId }) => {
    const isNftExists = await api.program.exists(nftProgramId);
    const isFtExists = await api.program.exists(ftProgramId);

    if (!isNftExists || !isFtExists) {
      if (!isNftExists) setFieldError('nftProgramId', 'Program not found in the storage');
      if (!isFtExists) setFieldError('ftProgramId', 'Program not found in the storage');

      return;
    }

    onSubmit({ nftProgramId, ftProgramId });
  });

  return (
    <form id={id} onSubmit={handleSubmit}>
      <Box>
        <Input label="GNFT Program ID" className={nftInputClassName} {...getInputProps('nftProgramId')} />
        <Input label="GFT Program ID" className={commonStyles.input} {...getInputProps('ftProgramId')} />
      </Box>
    </form>
  );
}

export { AddressForm };
