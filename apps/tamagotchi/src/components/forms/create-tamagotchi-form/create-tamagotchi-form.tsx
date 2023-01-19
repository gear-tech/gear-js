import { Button, Input, Select } from '@gear-js/ui';
import { useForm } from '@mantine/form';
// import { useGetLessonState } from 'app/hooks/use-get-lesson-state';
import { hexRequired } from 'app/utils/form-validations';
import { createTamagotchiInitial } from 'app/consts';
import { useLesson } from '../../../app/context';

const validate = {
  programId: hexRequired,
};

const options = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  // { value: 5, label: '5' },
];

export const CreateTamagotchiForm = () => {
  const { setLesson } = useLesson();
  // const { create } = useGetLessonState();
  const form = useForm({
    initialValues: createTamagotchiInitial,
    validate,
    validateInputOnChange: true,
  });
  const { getInputProps, errors } = form;
  const handleSubmit = form.onSubmit((values) => {
    // create(values);
    setLesson({ step: +values.currentStep, programId: values.programId });
  });

  return (
    <form onSubmit={handleSubmit} className="flex items-start justify-center gap-6">
      <div className="basis-[400px]">
        <Input placeholder="Insert program ID" direction="y" {...getInputProps('programId')} />
      </div>
      <div className="">
        <Select options={options} direction="y" {...getInputProps('currentStep')} />
      </div>
      <div className="whitespace-nowrap">
        <Button text="Create Tamagochi" color="primary" type="submit" disabled={Object.keys(errors).length > 0} />
      </div>
    </form>
  );
};
