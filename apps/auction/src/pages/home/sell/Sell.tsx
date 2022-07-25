import { Content, Info } from 'components';
import { Form } from './form';

function Sell() {
  return (
    <Content heading="Sell NFT">
      <Info text="As the time goes the price becomes lower. You can adjust discount rate per second." />
      <Form />
    </Content>
  );
}

export { Sell };
