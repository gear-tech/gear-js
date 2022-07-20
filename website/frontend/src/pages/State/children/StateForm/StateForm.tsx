import { useMemo, useEffect, useState } from 'react';
import { Formik, Form, FormikHelpers } from 'formik';
import { Metadata, Hex } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import { FormValues } from './types';
import { INITIAL_VALUES } from './const';
import { getValidationSchema } from './Schema';

import { getPreformattedText } from 'helpers';
import { getSubmitPayload, getPayloadFormValues } from 'components/common/Form/FormPayload/helpers';
import { Spinner } from 'components/common/Spinner/Spinner';
import { FormText, FormPayload, formStyles } from 'components/common/Form';

type Props = {
  metadata: Metadata;
  programId: string;
  metaBuffer: Buffer | null;
};

const StateForm = ({ metadata, programId, metaBuffer }: Props) => {
  const { api } = useApi();

  const [state, setState] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetState = () => {
    setState('');
    setIsLoading(true);
  };

  const readState = (options?: any) => {
    if (metaBuffer) {
      resetState();

      api.programState.read(programId as Hex, metaBuffer, options).then((result) => {
        setState(getPreformattedText(result.toHuman()));
        setIsLoading(false);
      });
    }
  };

  const handleSubmit = (values: FormValues, helpers: FormikHelpers<FormValues>) => {
    const payload = getSubmitPayload(values.payload);

    readState(payload);
    helpers.setSubmitting(false);
  };

  const encodeType = metadata.meta_state_input;

  const payloadFormValues = useMemo(() => getPayloadFormValues(metadata.types, encodeType), [metadata, encodeType]);

  const validationSchema = useMemo(() => getValidationSchema(encodeType, metadata), [metadata, encodeType]);

  useEffect(() => {
    if (metadata && !encodeType) {
      readState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata, encodeType]);

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      validateOnChange={false}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid }) => (
        <Form className={formStyles.largeForm}>
          <FormText text={programId} label="Program Id" />

          {payloadFormValues && <FormPayload name="payload" label="Input Parameters" values={payloadFormValues} />}

          {state && <FormText text={state} label="Statedata" isTextarea />}

          {isLoading && <Spinner />}

          {encodeType && (
            <div className={formStyles.formButtons}>
              <Button type="submit" text="Read state" disabled={!isValid || isLoading} />
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export { StateForm };
