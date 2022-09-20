import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Form } from 'react-final-form';

import sendSVG from 'shared/assets/images/actions/send.svg';
import closeSVG from 'shared/assets/images/actions/close.svg';
import { FormInput } from 'shared/ui/form';
import { GasField } from 'features/gasField';
import { FormPayload, getPayloadFormValues } from 'features/formPayload';
import { useProgram } from 'hooks';

import { Button } from '@gear-js/ui';
import { Box } from 'shared/ui/box';
import styles from './SendMessage.module.scss';

type Params = {
  programId: string;
};

const SendMessage = () => {
  const { programId } = useParams<Params>();

  const { metadata, isLoading } = useProgram(programId, true);
  const encodeType = metadata?.handle_input;

  const payloadFormValues = useMemo(() => getPayloadFormValues(metadata?.types, encodeType), [metadata, encodeType]);

  return (
    <>
      <h2 className={styles.heading}>Send Message</h2>
      <Form onSubmit={() => {}} initialValues={{ destination: programId }}>
        {({ form, handleSubmit }) => {
          // formApi.current = form;
          console.log();

          return (
            <form onSubmit={handleSubmit}>
              <Box className={styles.body}>
                <FormInput name="destination" label="Destination" gap="1/4" readOnly />
                <FormPayload name="payload" label="Payload" values={payloadFormValues} gap="1/4" />

                <GasField
                  name="gasLimit"
                  label="Gas limit"
                  placeholder="0"
                  disabled={false}
                  onGasCalculate={() => {}}
                  gap="1/4"
                  className={styles.gas}
                />

                <FormInput name="value" label="Value" gap="1/4" />
              </Box>

              <Button text="Send Message" icon={sendSVG} color="secondary" className={styles.button} />
              <Button text="Cancel" icon={closeSVG} color="light" />
            </form>
          );
        }}
      </Form>
    </>
  );
};

export { SendMessage };
