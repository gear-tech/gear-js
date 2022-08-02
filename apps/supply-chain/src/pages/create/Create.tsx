import { Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { Box, Content, Input } from 'components';
import clsx from 'clsx';
import { InitPayload } from 'types';
import { Users } from './users';
import styles from './Create.module.scss';

const users = ['0x00', '0x01', '0x00', '0x01'] as Hex[];

type Props = {
  onCancel: () => void;
  onSubmit: (value: InitPayload) => void;
};

function Create({ onCancel, onSubmit }: Props) {
  const nftInputClassName = clsx(styles.input, styles.nftInput);

  const handleSubmit = () => onSubmit({} as InitPayload);

  return (
    <Content
      heading="Enter GNFT Program ID, GFT Program ID and add users to create a supply chain"
      className={styles.content}>
      <form>
        <Box>
          <Input label="GNFT Program ID" className={nftInputClassName} />
          <Input label="GFT Program ID" className={styles.input} />
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
          <Button type="submit" text="Create" onClick={handleSubmit} />
        </div>
      </form>
    </Content>
  );
}

export { Create };
