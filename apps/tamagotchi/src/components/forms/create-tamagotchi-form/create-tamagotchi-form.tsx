import { Button, Input } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { isExists } from 'app/utils';

const initialValues = {
  gameName: '',
};

const validate = {
  gameName: isExists,
};

export const CreateTamagotchiForm = () => {
  const form = useForm({ initialValues, validate });
  const { getInputProps } = form;
  const handleSubmit = form.onSubmit((values) => {
    console.log('submitted');
  });

  return (
    <form onSubmit={handleSubmit} className="flex items-start justify-center gap-6">
      <div className="basis-[400px]">
        <Input placeholder="Insert program ID" direction="y" {...getInputProps('gameName')} />
      </div>
      <div className="whitespace-nowrap">
        <Button text="Create Tamagochi" color="primary" type="submit" />
      </div>
    </form>
  );
};
