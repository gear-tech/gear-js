import { Button, Input, Textarea } from '@gear-js/ui';
import { Hex, Metadata } from '@gear-js/api';
import { useEffect, useMemo } from 'react';
import { Form } from 'react-final-form';

import { BackButton } from 'shared/ui/backButton';
import { Box } from 'shared/ui/box';
import readSVG from 'shared/assets/images/actions/read.svg';
import { FormPayload, getPayloadFormValues, getSubmitPayload } from 'features/formPayload';
import { getPreformattedText, getValidation } from 'shared/helpers';
import { useStateRead } from 'hooks';

import { FormValues, INITIAL_VALUES } from '../model';
import { getValidationSchema } from '../helpers';
import styles from './StateForm.module.scss';

type Props = {
  meta: Metadata | undefined;
  metaBuffer: Buffer | undefined;
  programId: Hex;
  isLoading: boolean;
};

const StateForm = ({ meta, metaBuffer, programId, isLoading }: Props) => {
  const { state, isReaded, readState } = useStateRead(programId, metaBuffer);
  const isState = state !== undefined; // could be null

  const handleSubmit = async (values: FormValues) => {
    const payload = getSubmitPayload(values.payload);

    await readState(payload);
  };

  const encodeType = meta?.meta_state_input;

  const payloadFormValues = useMemo(() => getPayloadFormValues(meta?.types, encodeType), [meta, encodeType]);

  const validation = useMemo(
    () => {
      const schema = getValidationSchema(encodeType, meta);

      return getValidation(schema);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [meta, encodeType],
  );

  useEffect(() => {
    if (meta && !encodeType) readState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta, encodeType]);

  return (
    <Form initialValues={INITIAL_VALUES} validate={validation} onSubmit={handleSubmit} validateOnBlur>
      {(formApi) => (
        <form onSubmit={formApi.handleSubmit}>
          <Box className={styles.body}>
            {isLoading ? (
              <Input label="Program ID:" gap="1/5" className={styles.loading} value="" readOnly />
            ) : (
              <Input label="Program ID:" gap="1/5" value={programId} readOnly />
            )}

            {payloadFormValues &&
              (isLoading ? (
                <Textarea label="Payload" gap="1/5" className={styles.loading} readOnly />
              ) : (
                <FormPayload name="payload" label="Input Parameters" values={payloadFormValues} gap="1/5" />
              ))}

            {!isReaded && <Textarea label="Statedata:" rows={15} gap="1/5" className={styles.loading} readOnly block />}

            {isReaded && isState && (
              <Textarea label="Statedata:" rows={15} gap="1/5" value={getPreformattedText(state)} readOnly block />
            )}
          </Box>

          {encodeType && (
            <Button
              type="submit"
              text="Read State"
              icon={readSVG}
              color="secondary"
              size="large"
              className={styles.button}
            />
          )}
          <BackButton />
        </form>
      )}
    </Form>
  );
};

export { StateForm };
