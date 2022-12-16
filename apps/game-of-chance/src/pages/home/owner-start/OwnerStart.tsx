import { Content } from 'components';
import { SUBHEADING } from 'consts';
import { Form } from './form';

function OwnerStart() {
  return (
    <Content subheading={SUBHEADING.FORM}>
      <Form />
    </Content>
  );
}

export { OwnerStart };
