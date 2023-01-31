import { Button, buttonStyles, Input, Select } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { hexRequired } from 'app/utils/form-validations';
import { createTamagotchiInitial } from 'app/consts';
import { useBattle, useLesson } from 'app/context';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

const validate: Record<string, typeof hexRequired> = {
  programId: hexRequired,
};

const options = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
];

export const CreateTamagotchiForm = () => {
  const navigate = useNavigate();
  const { setLesson } = useLesson();
  // const { setPlayers } = useBattle();
  const [validation, setValidation] = useState(validate);
  const form = useForm({
    initialValues: createTamagotchiInitial,
    validate: validation,
    validateInputOnChange: true,
  });
  const { getInputProps, errors } = form;
  const handleSubmit = form.onSubmit((values) => {
    if (+form.values.currentStep === 6) {
      // setPlayers({ p1: values.programId, p2: values.programId2 });
      navigate('/battle');
    } else {
      setLesson({ step: +values.currentStep, programId: values.programId });
    }
  });

  useEffect(() => {
    if (+form.values.currentStep === 6) {
      setValidation({ ...validation, programId2: hexRequired });
    } else {
      setValidation(validation);
    }
  }, [form.values.currentStep]);

  return (
    <form onSubmit={handleSubmit} className="flex items-start justify-center gap-6">
      {+form.values.currentStep === 6 ? (
        <>
          <Link to="/battle" className={clsx('btn gap-2 whitespace-nowrap', buttonStyles.primary)}>
            Let's Battle!
          </Link>
        </>
      ) : (
        <>
          <div className="basis-[400px]">
            <Input placeholder="Insert program ID" direction="y" {...getInputProps('programId')} />
          </div>
          <div className="">
            <Select options={options} direction="y" {...getInputProps('currentStep')} />
          </div>
          <div className="whitespace-nowrap">
            <Button text="Create Tamagochi" color="primary" type="submit" disabled={Object.keys(errors).length > 0} />
          </div>
        </>
      )}
    </form>
  );
};
