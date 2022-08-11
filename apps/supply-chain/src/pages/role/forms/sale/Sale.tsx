import { Select } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { Form, Input } from 'components';
import { isExists } from 'utils';
import commonStyles from '../../Role.module.scss';

type Props = {
  heading: string;
  items: string[] | undefined;
  onSubmit: () => void;
};

const validate = { price: isExists };

function Sale({ heading, items, onSubmit }: Props) {
  // TODO: take a look after gear-js/ui update for undefined select value
  const initialValues = { itemId: items?.[0], price: '' };
  const isAnyItem = !!items?.length;

  const form = useForm({ initialValues, validate });
  const { getInputProps } = form;

  const getOptions = () => items?.map((id) => ({ label: id, value: id }));
  const options = getOptions() || [];

  return isAnyItem ? (
    <Form heading={heading} onSubmit={onSubmit}>
      <Select label="Item ID" options={options} className={commonStyles.input} {...getInputProps('itemId')} />
      <Input label="Price" inputClassName={commonStyles.input} {...getInputProps('price')} />
    </Form>
  ) : (
    <p className={commonStyles.text}>There are no items, please produce one</p>
  );
}

export { Sale };
