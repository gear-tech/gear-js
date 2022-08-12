import { Select } from '@gear-js/ui';
import { GetInputPropsPayload } from '@mantine/form/lib/types';
import { ReactNode } from 'react';
import { Form } from '../form';
import commonStyles from '../form/Form.module.scss';

type Props = {
  heading: string;
  items: string[] | undefined;
  action: string;
  selectProps: GetInputPropsPayload;
  children?: ReactNode;
  onSubmit: () => void;
};

function SelectForm({ heading, items, action, selectProps, children, onSubmit }: Props) {
  const isAnyItem = !!items?.length;

  const getOptions = () => items?.map((id) => ({ label: id, value: id }));
  const options = getOptions() || [];

  return isAnyItem ? (
    <Form heading={heading} onSubmit={onSubmit}>
      <Select label="Item ID" options={options} className={commonStyles.input} {...selectProps} />
      {children}
    </Form>
  ) : (
    <p className={commonStyles.text}>There are no items to {action}, please wait for one</p>
  );
}

export { SelectForm };
