import { Button, Input } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { isExists } from 'app/utils/form-validations';
import { Icon } from 'components/ui/icon';

const initialValues = {
  email: '',
};

const validate = {
  email: isExists,
};

export const ApproveAccountForm = () => {
  const form = useForm({ initialValues, validate });
  const { getInputProps } = form;
  const handleSubmit = form.onSubmit((values) => {
    console.log('submitted');
  });

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="">
        <Input placeholder="Enter the account address" type="email" direction="y" {...getInputProps('email')} />
      </div>
      <div className="whitespace-nowrap">
        <Button
          text="Approve"
          color="primary"
          type="submit"
          icon={() => <Icon name="check" className="w-5 h-5" />}
          className="w-full gap-2"
        />
      </div>
    </form>
  );
};
