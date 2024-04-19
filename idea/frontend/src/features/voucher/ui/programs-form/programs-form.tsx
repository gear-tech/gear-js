import { HexString } from '@gear-js/api';
import { Button } from '@gear-js/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

import CloseSVG from '@/shared/assets/images/actions/close.svg?react';
import { Input } from '@/shared/ui';

import { useProgramIdSchema } from '../../hooks';
import styles from './programs-form.module.scss';

const FIELD_NAME = {
  PROGRAM_ID: 'id',
} as const;

type Values = {
  [FIELD_NAME.PROGRAM_ID]: string;
};

type FormattedValues = {
  [FIELD_NAME.PROGRAM_ID]: HexString;
};

const DEFAULT_VALUES: Values = {
  [FIELD_NAME.PROGRAM_ID]: '',
} as const;

type Props = {
  value: HexString[];
  voucherValue?: HexString[];
  onChange: (value: (prevState: HexString[]) => HexString[]) => void;
};

const ProgramsForm = ({ value, voucherValue = [], onChange }: Props) => {
  const programIdSchema = useProgramIdSchema(value);

  const schema = z.object({
    [FIELD_NAME.PROGRAM_ID]: programIdSchema,
  });

  const form = useForm<Values, unknown, FormattedValues>({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(schema),
  });

  const add = (id: HexString) => onChange((prevValue) => [...prevValue, id]);
  const remove = (id: HexString) => onChange((prevValue) => prevValue.filter((_id) => id !== _id));

  const handleSubmit = ({ id }: FormattedValues) => {
    add(id);
    form.reset();
  };

  const renderPreviousPrograms = () =>
    voucherValue.map((id) => (
      <li key={id} className={styles.programId}>
        <span>{id}</span>
      </li>
    ));

  const renderPrograms = () =>
    value.map((id) => (
      <li key={id} className={styles.programId}>
        <span>{id}</span>

        <Button icon={CloseSVG} color="transparent" onClick={() => remove(id)} />
      </li>
    ));

  return (
    <FormProvider {...form}>
      <form className={styles.form} onSubmit={form.handleSubmit(handleSubmit)}>
        {/*  temporary button alignment fix */}
        <div className={clsx(styles.input, form.formState.errors['id'] && styles.error)}>
          <Input name="id" label="Program ID:" direction="y" block />
          <Button type="submit" text="Add" color="light" />
        </div>

        {Boolean([...voucherValue, ...value].length) && (
          <ul className={styles.programs}>
            {renderPreviousPrograms()}
            {renderPrograms()}
          </ul>
        )}
      </form>
    </FormProvider>
  );
};

export { ProgramsForm };
