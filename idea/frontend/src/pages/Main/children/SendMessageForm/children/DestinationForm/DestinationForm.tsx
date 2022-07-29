import { Form, Formik, FormikHelpers } from 'formik';
import { Button } from '@gear-js/ui';

import { Schema } from './Schema';
import { FormValues } from './types';

import { FormInput, formStyles } from 'components/common/Form';

type Props = {
  destination?: string;
  onReset: () => void;
  onSubmit: (values: FormValues, helpert: FormikHelpers<FormValues>) => void;
};

const DestinationForm = ({ destination = '', onSubmit, onReset }: Props) => (
  <Formik
    initialValues={{ destination }}
    validateOnChange={false}
    validationSchema={Schema}
    onSubmit={onSubmit}
    onReset={onReset}
  >
    {({ isValid, isSubmitting }) => {
      const isDisabled = !isValid || isSubmitting;

      return (
        <Form data-testid="sendMessageForm" className={formStyles.largeForm}>
          <FormInput name="destination" label="Destination" />

          <div className={formStyles.formButtons}>
            <Button type="submit" text="Next step" color="secondary" disabled={isDisabled} />
            <Button type="reset" text="Cancel" color="transparent" />
          </div>
        </Form>
      );
    }}
  </Formik>
);

export { DestinationForm };
