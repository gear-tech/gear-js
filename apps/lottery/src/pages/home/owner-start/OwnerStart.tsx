import { Button } from '@gear-js/ui';
import { useState } from 'react';
import { Content } from 'components';
import { Form } from './form';

const FORM_SUBHEADING =
  "Specify lottery duration and, if necessary, the address of the token contract and click the 'Submit and start' button to launch the lottery.";

const START_SUBHEADING = "Press 'Start' to set the lottery options.";

function OwnerStart() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const openForm = () => setIsFormOpen(true);

  return (
    <Content subheading={isFormOpen ? FORM_SUBHEADING : START_SUBHEADING}>
      {isFormOpen ? <Form /> : <Button text="Start" onClick={openForm} />}
    </Content>
  );
}

export { OwnerStart };
