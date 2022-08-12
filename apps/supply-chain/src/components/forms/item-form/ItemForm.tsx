import { useForm } from '@mantine/form';
import { SelectForm } from '../select-form';

type Props = {
  heading: string;
  items: string[] | undefined;
  action: string;
  onSubmit: () => void;
};

function ItemForm({ heading, items, action, onSubmit }: Props) {
  // TODO: take a look after gear-js/ui update for undefined select value
  const initialValues = { itemId: items?.[0] };

  const form = useForm({ initialValues });
  const { getInputProps } = form;

  return (
    <SelectForm
      heading={heading}
      items={items}
      action={action}
      selectProps={getInputProps('itemId')}
      onSubmit={onSubmit}
    />
  );
}

export { ItemForm };
