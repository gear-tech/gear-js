import { Button } from '@gear-js/ui';
import { useState } from 'react';
import { SUBHEADING } from 'consts';
import { Content } from 'components';
import { Form } from './form';

function Start() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const openForm = () => setIsFormOpen(true);

  return (
    <Content subheading={isFormOpen ? SUBHEADING.FORM : SUBHEADING.START}>
      {isFormOpen ? <Form /> : <Button text="Start" onClick={openForm} />}
    </Content>
  );
}

export { Start };
