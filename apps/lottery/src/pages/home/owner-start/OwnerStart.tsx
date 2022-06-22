import { Content } from 'components';
import { Form } from './form';

const START_SUBHEADING =
  "Specify lottery duration and, if necessary, the address of the token contract and click the 'Submit and start' button to launch the lottery.";

function OwnerStart() {
  return (
    <Content subheading={START_SUBHEADING}>
      <Form />
    </Content>
  );
}

export { OwnerStart };
