import { useForm } from '@mantine/form';
import { isExists } from 'utils';
import { Input } from '../../input';
import { SelectForm } from '../select-form';
import commonStyles from '../form/Form.module.scss';

type Props = {
  heading: string;
  label: string;
  name: string;
  items: string[] | undefined;
  action: string;
  onSubmit: () => void;
};

function ItemInputForm({ heading, label, name, items, action, onSubmit }: Props) {
  // TODO: take a look after gear-js/ui update for undefined select value
  const initialValues = { itemId: items?.[0], [name]: '' };
  const validate = { [name]: isExists };

  // @ts-ignore
  const form = useForm({ initialValues, validate });
  const { getInputProps } = form;

  return (
    <SelectForm
      heading={heading}
      items={items}
      action={action}
      selectProps={getInputProps('itemId')}
      onSubmit={onSubmit}>
      <Input label={label} inputClassName={commonStyles.input} {...getInputProps(name)} />
    </SelectForm>
  );
}

export { ItemInputForm };
