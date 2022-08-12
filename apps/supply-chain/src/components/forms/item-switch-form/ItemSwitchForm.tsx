import { Checkbox, inputStyles } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { SelectForm } from '../select-form';
import commonStyles from '../form/Form.module.scss';

type Props = {
  heading: string;
  items: string[] | undefined;
  action: string;
  onSubmit: () => void;
};

function ItemSwitchForm({ heading, items, action, onSubmit }: Props) {
  // TODO: take a look after gear-js/ui update for undefined select value
  const initialValues = { itemId: items?.[0], approve: false };

  const form = useForm({ initialValues });
  const { getInputProps } = form;

  return (
    <SelectForm
      heading={heading}
      items={items}
      action={action}
      selectProps={getInputProps('itemId')}
      onSubmit={onSubmit}>
      <div className={commonStyles.input}>
        <span className={inputStyles.label}>Approve</span>
        <Checkbox type="switch" label="Yes" {...getInputProps('approve')} />
      </div>
    </SelectForm>
  );
}

export { ItemSwitchForm };
