import { Button, Input, Select } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { useGetLessonState } from 'app/hooks/use-get-lesson-state';
import { hexRequired } from 'app/utils/form-validations';
import { createTamagotchiInitial } from 'app/consts';

const validate = {
  programId: hexRequired,
};

const options = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
];

export const CreateTamagotchiForm = () => {
  const { create } = useGetLessonState();
  const form = useForm({ initialValues: createTamagotchiInitial, validate });
  const { getInputProps } = form;
  const handleSubmit = form.onSubmit((values) => {
    create(values);
  });

  return (
    <form onSubmit={handleSubmit} className="flex items-start justify-center gap-6">
      <div className="basis-[400px]">
        <Input placeholder="Insert program ID" direction="y" {...getInputProps('programId')} />
      </div>
      <div className="">
        <Select options={options} title="fff" {...getInputProps('currentStep')} />
      </div>
      <div className="whitespace-nowrap">
        <Button text="Create Tamagochi" color="primary" type="submit" />
      </div>
    </form>
  );
};
