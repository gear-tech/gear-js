import { Content, Info } from 'components';
import { Form } from './form';
import styles from './Sell.module.scss';

function Sell() {
  return (
    <Content heading="Sell NFT" className={styles.content}>
      <Info text="As the time goes the price becomes lower. You can adjust discount rate per second." />
      <Form />
    </Content>
  );
}

export { Sell };
