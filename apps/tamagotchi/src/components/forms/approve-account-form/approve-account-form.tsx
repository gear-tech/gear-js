import { Button, Input } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { Icon } from 'components/ui/icon';
import { hexRequired } from 'app/utils/form-validations';
import { useTamagocthiMessage } from 'app/hooks/use-tamagotchi-message';
import { useUpdateState } from 'app/hooks/use-update-state';

const initialValues = {
  address: '',
};

const validate = {
  address: hexRequired,
};

export const ApproveAccountForm = ({ close }: { close: () => void }) => {
  const sendHandler = useTamagocthiMessage();
  const { update } = useUpdateState();
  const form = useForm({ initialValues, validate });
  const { getInputProps } = form;
  const onSuccess = () => {
    update();
    close();
  };

  const handleSubmit = form.onSubmit((values) => {
    sendHandler({ Approve: values.address }, { onSuccess });
  });

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="">
        <Input placeholder="Enter the account address" {...getInputProps('address')} />
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
