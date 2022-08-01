import { Button } from '@gear-js/ui';
import { Content } from 'components';
import styles from './Start.module.scss';

function Start() {
  return (
    <Content heading="Select an action to get started" className={styles.content}>
      <Button text="Create" className={styles.button} block />
      <Button text="Choose existing one" color="secondary" className={styles.button} block />
    </Content>
  );
}

export { Start };
