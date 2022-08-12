import { useMemo, useEffect } from 'react';
import { Formik, Form } from 'formik';
import { Metadata, Hex } from '@gear-js/api';
import { Button } from '@gear-js/ui';

import { FormValues } from './types';
import { INITIAL_VALUES } from './const';
import { getValidationSchema } from './Schema';

import { useStateRead } from 'hooks';
import { getPreformattedText } from 'helpers';
import { getSubmitPayload, getPayloadFormValues } from 'components/common/Form/FormPayload/helpers';
import { Spinner } from 'components/common/Spinner/Spinner';
import { FormText, FormPayload, formStyles } from 'components/common/Form';

type Props = {
  metadata: Metadata;
  programId: string;
  metaBuffer: Buffer;
};

const StateForm = ({ metadata, programId, metaBuffer }: Props) => {
  const { state, isReaded, readState } = useStateRead(programId as Hex, metaBuffer);

  const handleSubmit = async (values: FormValues) => {
    const payload = getSubmitPayload(values.payload);

    await readState(payload);
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
      {({ isValid, isSubmitting }) => (
        <Form className={formStyles.largeForm}>
          <FormText text={programId} label="Program Id" />

          {payloadFormValues && <FormPayload name="payload" label="Input Parameters" values={payloadFormValues} />}
          {/* may be null */}
          {state !== undefined && <FormText text={getPreformattedText(state)} label="Statedata" isTextarea />}

          {!isReaded && <Spinner />}

          {encodeType && (
            <div className={formStyles.formButtons}>
              <Button type="submit" text="Read state" disabled={!isValid || isSubmitting} />
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};

export { StateForm };
