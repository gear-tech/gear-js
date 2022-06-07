import { useCallback, useEffect, useRef, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import { Formik, Form } from 'formik';
import { Metadata } from '@gear-js/api';
import { Button } from '@gear-js/ui';

import styles from './State.module.scss';
import { FormValues, PageParams } from './types';
import { INITIAL_VALUES } from './const';

import { useApi } from 'hooks';
import { getMetadata } from 'services';
import { getPreformattedText } from 'helpers';
import { getSubmitPayload, getPayloadFormValues } from 'components/common/Form/FormPayload/helpers';
import { Box } from 'layout/Box/Box';
import { FormPayload } from 'components/common/Form/FormPayload';
import { Spinner } from 'components/common/Spinner/Spinner';
import { PageHeader } from 'components/blocks/PageHeader/PageHeader';
import { formStyles } from 'components/common/Form';

const State = () => {
  const { api } = useApi();
  const { programId } = useParams() as PageParams;

  const metaBuffer = useRef<Buffer | null>(null);

  const [state, setState] = useState('');
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const types = metadata?.types;
  const stateInput = metadata?.meta_state_input;

  const disableLoading = () => {
    setIsLoading(false);
  };

  const resetState = () => {
    setState('');
    setIsLoading(true);
  };

  const readState = useCallback(
    (options?: object | string) => {
      if (metaBuffer.current) {
        resetState();

        api?.programState.read(programId, metaBuffer.current, options).then((result) => {
          const formattedState = result.toHuman();
          setState(getPreformattedText(formattedState));
          disableLoading();
        });
      }
    },
    [api, programId]
  );

  const handleSubmit = (values: FormValues) => {
    const payload = getSubmitPayload(values.payload);

    readState(payload);
  };

  const typeStructures = useMemo(() => getPayloadFormValues(types, stateInput), [types, stateInput]);

  const formItemClasses = clsx(formStyles.formItem, formStyles.field);

  useEffect(() => {
    getMetadata(programId).then(({ result }) => {
      const parsedMeta = JSON.parse(result.meta) as Metadata;

      metaBuffer.current = Buffer.from(result.metaFile, 'base64');
      setMetadata(parsedMeta);
      disableLoading();
    });
  }, [programId]);

  useEffect(() => {
    if (metadata && !stateInput) {
      readState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metadata, stateInput]);

  return (
    <div className="wrapper">
      <PageHeader title="Read state" />
      <Box>
        <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
          <Form className={formStyles.largeForm}>
            <div className={formItemClasses}>
              <label className={clsx(styles.programIdTitle, formStyles.fieldLabel)}>Program Id</label>
              <p className={clsx(styles.programId, formStyles.fieldContent)}>{programId}</p>
            </div>

            {typeStructures?.payload && <FormPayload name="payload" label="Input Parameters" values={typeStructures} />}

            {state && (
              <div className={formItemClasses}>
                <label className={clsx(styles.stateTitle, formStyles.fieldLabel)}>Statedata</label>
                <pre className={clsx(styles.stateValue, formStyles.fieldContent)}>{state}</pre>
              </div>
            )}

            {isLoading && <Spinner />}

            {stateInput && (
              <div className={formStyles.formButtons}>
                <Button type="submit" text="Read state" />
              </div>
            )}
          </Form>
        </Formik>
      </Box>
    </div>
  );
};

export { State };
