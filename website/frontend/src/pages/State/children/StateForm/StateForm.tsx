import { useMemo, useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { Metadata } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import { FormValues } from './types';
import { INITIAL_VALUES } from './const';

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

  const types = metadata.types;
  const stateInput = metadata.meta_state_input;

  const resetState = () => {
    setState('');
    setIsLoading(true);
  };

  const readState = (options?: object | string) => {
    if (metaBuffer) {
      resetState();

      api.programState.read(programId, metaBuffer, options).then((result) => {
        setState(getPreformattedText(result.toHuman()));
        setIsLoading(false);
      });
    }
  };

  const handleSubmit = (values: FormValues) => {
    const payload = getSubmitPayload(values.payload);

    readState(payload);
  };

  const payloadFormValues = useMemo(() => getPayloadFormValues(types, stateInput), [types, stateInput]);

  useEffect(() => {
    if (metadata && !stateInput) {
      readState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata, stateInput]);

  return (
    <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
      <Form className={formStyles.largeForm}>
        <FormText text={programId} label="Program Id" />

        {payloadFormValues && <FormPayload name="payload" label="Input Parameters" values={payloadFormValues} />}

        {state && <FormText text={state} label="Statedata" isTextarea />}

        {isLoading && <Spinner />}

        {stateInput && (
          <div className={formStyles.formButtons}>
            <Button type="submit" text="Read state" />
          </div>
        )}
      </Form>
    </Formik>
  );
};

export { StateForm };
