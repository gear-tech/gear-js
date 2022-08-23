import { useForm } from '@mantine/form';
import { SelectForm } from '../select-form';

type Props = {
  heading: string;
  items: string[];
  action: string;
  onSubmit: (value: any, onSuccess: () => void) => void;
};

function ItemForm({ heading, items, action, onSubmit }: Props) {
  // TODO: take a look after gear-js/ui update for undefined select value
  const initialValues = { itemId: items[0] };

  const form = useForm({ initialValues });
  const { getInputProps, reset } = form;

  const handleSubmit = form.onSubmit((values) => onSubmit(values, reset));

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
