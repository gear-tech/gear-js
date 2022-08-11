import { Select } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { Form } from 'components';
import commonStyles from '../../Role.module.scss';

type Props = {
  heading: string;
  items: string[] | undefined;
  onSubmit: () => void;
};

function Ship({ heading, items, onSubmit }: Props) {
  // TODO: take a look after gear-js/ui update for undefined select value
  const initialValues = { itemId: items?.[0] };
  const isAnyItem = !!items?.length;

  const form = useForm({ initialValues });
  const { getInputProps } = form;

  const getOptions = () => items?.map((id) => ({ label: id, value: id }));
  const options = getOptions() || [];

  return isAnyItem ? (
    <Form heading={heading} onSubmit={onSubmit}>
      <Select label="Item ID" options={options} className={commonStyles.input} {...getInputProps('itemId')} />
    </Form>
  ) : (
    <p className={commonStyles.text}>There are no items to ship, please wait for one</p>
  );
}

export { Ship };
