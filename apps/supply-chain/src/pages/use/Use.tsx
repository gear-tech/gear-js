import { Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { Box, Content, Input } from 'components';
import styles from './Use.module.scss';

type Props = {
  onCancel: () => void;
  onSubmit: (value: Hex) => void;
};

function Use({ onCancel, onSubmit }: Props) {
  const handleSubmit = () => onSubmit('' as Hex);

  return (
    <Content
      heading="Type here the ID of an existing supply chain program 
  and click “Login” to continue."
      className={styles.content}>
      <form>
        <Box>
          <Input label="Program ID" className={styles.input} />
        </Box>
        <div className={styles.buttons}>
          <Button text="Cancel" color="secondary" onClick={onCancel} />
          <Button type="submit" text="Submit" onClick={handleSubmit} />
        </div>
      </form>
    </Content>
  );
}

export { Use };
