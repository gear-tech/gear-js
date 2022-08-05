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

const initialValues = {
  ftProgramId: '0xaa384c1419009bb86e1386f7460478c9ab48fa5f55ef09f0fde65fe88e1fee0e' as Hex,
  nftProgramId: '0xd2786de18d6440446f1c5d1cfe1758e07c17ff5af99c263bcac1ef0b4aefa5d6' as Hex,
};
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
