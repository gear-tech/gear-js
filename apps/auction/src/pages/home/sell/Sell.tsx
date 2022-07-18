import { Content } from 'components';
import { Form } from './form';
import styles from './Sell.module.scss';

function Sell() {
  return (
    <Content heading="Sell NFT" className={styles.content}>
      <div className={styles.info}>
        <p>As the time goes the price becomes lower. You can adjust discount rate per ms.</p>
      </div>
      <Form />
    </Content>
  );
}

export { Sell };
