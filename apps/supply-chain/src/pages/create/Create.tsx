import { Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import clsx from 'clsx';
import { useApi } from '@gear-js/react-hooks';
import { SetStateAction, useState } from 'react';
import { Box, Content, Input } from 'components';
import { InitPayload } from 'types';
import { isValidHex } from 'utils';
import { USER } from 'consts';
import { Empty } from './empty';
import { Users } from './users';
import styles from './Create.module.scss';

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

  const userForm = useForm({ initialValues: { user: '' as Hex }, validate: { user: isValidHex } });

  const [producers, setProducers] = useState([] as Hex[]);
  const [distributors, setDistributors] = useState([] as Hex[]);
  const [retailers, setRetailers] = useState([] as Hex[]);
  const isAnyUser = producers.length > 0 || distributors.length > 0 || retailers.length > 0;

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

  const addUser = (setUsers: (callback: SetStateAction<Hex[]>) => void) =>
    setUsers((prevUsers) => [...prevUsers, userForm.values.user]);

  const removeUser = (setUsers: (callback: SetStateAction<Hex[]>) => void) => (id: number) =>
    setUsers((prevUsers) => prevUsers.filter((_user, index) => index !== id));

  const removeDistrubutor = removeUser(setDistributors);
  const removeRetailer = removeUser(setRetailers);
  const removeProducer = removeUser(setProducers);

  const getUsersSetter = (submitName: string) => {
    switch (submitName) {
      case USER.DISTRIBUTOR:
        return setDistributors;
      case USER.RETAILER:
        return setRetailers;
      default:
        return setProducers;
    }
  };

  const handleUserSubmit = userForm.onSubmit((_values, e) => {
    // @ts-ignore
    const submitButtonName = e.nativeEvent.submitter.name;
    addUser(getUsersSetter(submitButtonName));
    userForm.reset();
  });

  return (
    <Content
      heading="Enter GNFT Program ID, GFT Program ID and add users to create a supply chain"
      className={styles.content}>
      <form id="create" onSubmit={handleSubmit}>
        <Box>
          <Input label="GNFT Program ID" className={nftInputClassName} {...getInputProps('nftProgramId')} />
          <Input label="GFT Program ID" className={styles.input} {...getInputProps('ftProgramId')} />
        </Box>
      </form>

      <Box>
        <form onSubmit={handleUserSubmit}>
          <Input label="User ID" className={styles.input} {...userForm.getInputProps('user')} />
          <div className={styles.buttonsAction}>
            <Button type="submit" text="Add producer" color="secondary" size="small" name={USER.PRODUCER} />
            <Button type="submit" text="Add distributor" color="secondary" size="small" name={USER.DISTRIBUTOR} />
            <Button type="submit" text="Add retailer" color="secondary" size="small" name={USER.RETAILER} />
          </div>
        </form>

        <div className={styles.users}>
          <Users heading="Producers" list={producers} onRemoveButtonClick={removeProducer} />
          <Users heading="Distributors" list={distributors} onRemoveButtonClick={removeDistrubutor} />
          <Users heading="Retailers" list={retailers} onRemoveButtonClick={removeRetailer} />
          {!isAnyUser && <Empty />}
        </div>
      </Box>

      <div className={styles.buttonsSubmit}>
        <Button text="Cancel" color="secondary" onClick={onCancel} />
        <Button type="submit" form="create" text="Create" />
      </div>
    </Content>
  );
}

export { Create };
