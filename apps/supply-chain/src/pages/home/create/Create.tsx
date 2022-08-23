import { Button } from '@gear-js/ui';
import { Content } from 'components';
import { InitPayload } from 'types';
import { FORM } from 'consts';
import { useUsers } from 'hooks';
import { Empty } from './empty';
import { Users } from './users';
import { AddressForm } from './address-form';
import { UserForm } from './user-form';
import styles from './Create.module.scss';

type Props = {
  onCancel: () => void;
  onSubmit: (value: InitPayload) => void;
};

function Create({ onCancel, onSubmit }: Props) {
  const { list, action, isAnyUser } = useUsers();
  const { distributors, retailers, producers } = list;
  const { removeDistrubutor, removeProducer, removeRetailer, getUserSubmit } = action;

  return (
    <Content
      heading="Enter GNFT Program ID, GFT Program ID and add users to create a supply chain"
      className={styles.content}>
      <AddressForm id={FORM.CREATE} onSubmit={(addresses) => onSubmit({ ...addresses, ...list })} />

      <div className={styles.box}>
        <UserForm onSubmit={getUserSubmit} />
        <div className={styles.users}>
          <Users heading="Producers" list={producers} onRemoveButtonClick={removeProducer} />
          <Users heading="Distributors" list={distributors} onRemoveButtonClick={removeDistrubutor} />
          <Users heading="Retailers" list={retailers} onRemoveButtonClick={removeRetailer} />
          {!isAnyUser && <Empty />}
        </div>
      </div>

      <div className={styles.buttons}>
        <Button text="Cancel" color="secondary" onClick={onCancel} />
        <Button type="submit" form={FORM.CREATE} text="Create" />
      </div>
    </Content>
  );
}

export { Create };
