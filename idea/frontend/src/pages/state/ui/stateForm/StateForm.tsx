import { Input, Textarea } from '@gear-js/ui';
import { AnyJson } from '@polkadot/types/types';
import { HexString } from '@polkadot/util/types';
import { Form } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';

import { getPreformattedText } from '@/shared/helpers';
import { Box } from '@/shared/ui/box';
import { FormPayload, FormPayloadValues } from '@/features/formPayload';

import { FormValues, INITIAL_VALUES } from '../../model';
import styles from './StateForm.module.scss';

type Props = {
  programId: HexString;
  state: AnyJson;
  payloadFormValues: FormPayloadValues | undefined;
  isLoading: boolean;
  isStateRead: boolean;
  isState: boolean;
  onSubmit: (values: FormValues) => void;
  onPayloadChange: () => void;
};

const StateForm = (props: Props) => {
  const { onSubmit, onPayloadChange, programId, state, payloadFormValues, isLoading, isStateRead, isState } = props;

  return (
    <Form initialValues={INITIAL_VALUES} onSubmit={onSubmit}>
      {(formApi) => (
        <form id="state" onSubmit={formApi.handleSubmit}>
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

            <OnChange name="payload">{() => onPayloadChange()}</OnChange>
            {!isStateRead && (
              <Textarea label="Statedata:" rows={15} gap="1/5" className={styles.loading} readOnly block />
            )}

            {isStateRead && isState && (
              <Textarea label="Statedata:" rows={15} gap="1/5" value={getPreformattedText(state)} readOnly block />
            )}
          </Box>
        </form>
      )}
    </Form>
  );
};

export { StateForm };
