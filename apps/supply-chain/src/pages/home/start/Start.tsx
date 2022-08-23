import { Button } from '@gear-js/ui';
import { Content } from 'components';
import styles from './Start.module.scss';

type Props = {
  onCreate: () => void;
  onUse: () => void;
};

function Start({ onCreate, onUse }: Props) {
  return (
    <Content heading="Select an action to get started" className={styles.content}>
      <Button text="Create" className={styles.button} onClick={onCreate} block />
      <Button text="Choose existing one" color="secondary" className={styles.button} onClick={onUse} block />
    </Content>
  );
}

export { Start };
