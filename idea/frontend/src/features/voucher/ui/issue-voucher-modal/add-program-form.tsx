import { Button } from '@gear-js/ui';
import { FormProvider } from 'react-hook-form';

import CloseSVG from '@/shared/assets/images/actions/close.svg?react';

import { useAddProgramForm } from './hooks';
import styles from './issue-voucher-modal.module.scss';
import { Input } from '@/shared/ui';

type Props = {
  form: ReturnType<typeof useAddProgramForm>['form'];
  fieldArray: ReturnType<typeof useAddProgramForm>['fieldArray'];
};

const AddProgramForm = ({ form, fieldArray }: Props) => {
  const { resetField } = form;
  const { fields, append, remove } = fieldArray;

  const handleSubmit = form.handleSubmit(({ id }) => {
    append({ value: id });
    resetField('id');
  });

  const renderPrograms = () =>
    fields.map(({ id, value }, index) => (
      <li key={id} className={styles.programId}>
        <span>{value}</span>

        <Button icon={CloseSVG} color="transparent" onClick={() => remove(index)} />
      </li>
    ));

  return (
    <FormProvider {...form}>
      <form className={styles.addProgram} onSubmit={handleSubmit}>
        <Input name="id" label="Program ID:" direction="y" block />

        {Boolean(fields.length) && <ul>{renderPrograms()}</ul>}

        <Button type="submit" text="Add" color="light" size="small" block />
      </form>
    </FormProvider>
  );
};

export { AddProgramForm };
