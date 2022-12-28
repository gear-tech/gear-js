import { Button, Input } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { useGetLessonState } from 'app/hooks/use-get-lesson-state';
import { hexRequired } from 'app/utils/form';
import { Hex } from '@gear-js/api';

const initialValues = {
  programId: '',
};

const validate = {
  programId: hexRequired,
};

export const CreateTamagotchiForm = () => {
  const { create } = useGetLessonState();
  const form = useForm({ initialValues, validate });
  const { getInputProps } = form;
  const handleSubmit = form.onSubmit((values) => {
    create(values.programId as Hex);
  });

  return (
    <form onSubmit={handleSubmit} className="flex items-start justify-center gap-6">
      <div className="basis-[400px]">
        <Input placeholder="Insert program ID" direction="y" {...getInputProps('programId')} />
      </div>
      <div className="whitespace-nowrap">
        <Button text="Create Tamagochi" color="primary" type="submit" />
      </div>
    </form>
  );
};
