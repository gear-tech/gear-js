import { Button, Input } from '@gear-js/ui';
import { Content } from '../../content';
import styles from './Config.module.scss';

function Config() {
  return (
    <Content
      subheading="Specify lottery duration and, if necessary, the address of the token contract and click the 'Submit and
start' button to launch the lottery.">
      <form className={styles.form}>
        <Input type="number" className={styles.input} label="Lottery duration (hours)" />
        <Input className={styles.input} label="Fungible token address" />
        <Input type="number" className={styles.input} label="Prize fund" />
        <Input type="number" className={styles.input} label="Cost of participation" />
      </form>
      <Button text="Submit and start" />
    </Content>
  );
}

export { Config };
