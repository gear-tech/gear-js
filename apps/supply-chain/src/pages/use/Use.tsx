import { Input, Button } from '@gear-js/ui';
import { Box, Content } from 'components';
import styles from './Use.module.scss';

function Use() {
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
          <Button text="Cancel" color="secondary" />
          <Button type="submit" text="Submit" />
        </div>
      </form>
    </Content>
  );
}

export { Use };
