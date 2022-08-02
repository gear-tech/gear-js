import { Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import clsx from 'clsx';
import { Box, Content, Input } from 'components';
import { InitPayload } from 'types';
import { isValidHex } from 'utils';
import { useApi } from '@gear-js/react-hooks';
import { useState } from 'react';
import { Users } from './users';
import styles from './Create.module.scss';

const users = ['0x00', '0x01', '0x00', '0x01'] as Hex[];

type Props = {
  onCancel: () => void;
  onSubmit: (value: InitPayload) => void;
};

const initialValues = { ftProgramId: '' as Hex, nftProgramId: '' as Hex };
const validate = { ftProgramId: isValidHex, nftProgramId: isValidHex };

function Create({ onCancel, onSubmit }: Props) {
  const { api } = useApi();

  const form = useForm({ initialValues, validate });
  const { getInputProps, values, setFieldError } = form;

  const [producers, setProducers] = useState([] as Hex[]);
  const [distributors, setDistributors] = useState([] as Hex[]);
  const [retailers, setRetailers] = useState([] as Hex[]);

  const nftInputClassName = clsx(styles.input, styles.nftInput);

  const handleSubmit = form.onSubmit(async () => {
    const isNftExists = await api.program.exists(values.nftProgramId);
    const isFtExists = await api.program.exists(values.ftProgramId);

    if (!isNftExists || !isFtExists) {
      if (!isNftExists) setFieldError('nftProgramId', 'Program not found in the storage');
      if (!isFtExists) setFieldError('ftProgramId', 'Program not found in the storage');

      return;
    }

    onSubmit({ ...values, producers, distributors, retailers });
  });

  return (
    <Content
      heading="Enter GNFT Program ID, GFT Program ID and add users to create a supply chain"
      className={styles.content}>
      <form onSubmit={handleSubmit}>
        <Box>
          <Input label="GNFT Program ID" className={nftInputClassName} {...getInputProps('nftProgramId')} />
          <Input label="GFT Program ID" className={styles.input} {...getInputProps('ftProgramId')} />
        </Box>

        <Box>
          <Input label="User ID" className={styles.input} />
          <div className={styles.buttonsAction}>
            <Button text="Add producer" color="secondary" size="small" />
            <Button text="Add distributor" color="secondary" size="small" />
            <Button text="Add retailer" color="secondary" size="small" />
          </div>

          <div className={styles.users}>
            <Users heading="Producers" list={users} />
            <Users heading="Distributors" list={users} />
            <Users heading="Retailers" list={users} />
          </div>
        </Box>

        <div className={styles.buttonsSubmit}>
          <Button text="Cancel" color="secondary" onClick={onCancel} />
          <Button type="submit" text="Create" />
        </div>
      </form>
    </Content>
  );
}

export { Create };
