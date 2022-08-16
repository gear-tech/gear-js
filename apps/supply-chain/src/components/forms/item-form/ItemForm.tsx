import { useForm } from '@mantine/form';
import { SelectForm } from '../select-form';

type Props = {
  heading: string;
  items: string[];
  action: string;
  onSubmit: (value: string) => void;
};

function ItemForm({ heading, items, action, onSubmit }: Props) {
  // TODO: take a look after gear-js/ui update for undefined select value
  const initialValues = { itemId: items[0] };

  const form = useForm({ initialValues });
  const { getInputProps } = form;

  const handleSubmit = form.onSubmit(({ itemId }) => onSubmit(itemId));

  return (
    <SelectForm
      heading={heading}
      items={items}
      action={action}
      selectProps={getInputProps('itemId')}
      onSubmit={handleSubmit}
    />
  );
}

export { ItemForm };
