import { Form, Formik, FormikHelpers } from 'formik';
import { Button } from '@gear-js/ui';

import { Schema } from './Schema';
import { FormValues } from './types';

import { FormInput, formStyles } from 'components/common/Form';

type Props = {
  isLoading: boolean;
  destination?: string;
  onSubmit: (values: FormValues, helpert: FormikHelpers<FormValues>) => void;
};

const ProgramForm = ({ isLoading, destination = '', onSubmit }: Props) => (
  <Formik initialValues={{ destination }} validateOnChange={false} validationSchema={Schema} onSubmit={onSubmit}>
    {({ isValid, isSubmitting }) => {
      const isDisabled = isLoading || !isValid || isSubmitting;

      return (
        <Form data-testid="sendMessageForm" className={formStyles.largeForm}>
          <FormInput name="destination" label="Destination" placeholder="Destination" />

          <div className={formStyles.formButtons}>
            <Button type="submit" text="Find program" disabled={isDisabled} />
          </div>
        </Form>
      );
    }}
  </Formik>
);

export { ProgramForm };
