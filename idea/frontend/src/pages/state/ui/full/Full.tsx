import { Button, Input, Textarea } from '@gear-js/ui';
import { useMemo } from 'react';
import { Form } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';

import { useProgram, useStateRead } from 'hooks';
import { getPreformattedText, isNullOrUndefined } from 'shared/helpers';
import { BackButton } from 'shared/ui/backButton';
import { Box } from 'shared/ui/box';
import { isHumanTypesRepr, useMetadata } from 'features/metadata';
import { FormPayload, getPayloadFormValues, getSubmitPayload } from 'features/formPayload';
import ReadSVG from 'shared/assets/images/actions/read.svg?react';

import { FormValues, INITIAL_VALUES } from '../../model';
import { downloadJson } from '../../helpers';
import { useProgramId } from '../../hooks';
import styles from './Full.module.scss';

const Full = () => {
  const programId = useProgramId();

  const { program } = useProgram(programId);
  const { metadata, isMetadataReady } = useMetadata(program?.metahash);
  const { state, isStateRead, isState, readFullState, resetState } = useStateRead(programId);

  const payloadFormValues = useMemo(
    () =>
      metadata && isHumanTypesRepr(metadata.types.state) && !isNullOrUndefined(metadata.types.state.input)
        ? getPayloadFormValues(metadata, metadata.types.state.input)
        : undefined,
    [metadata],
  );

  const handleSubmit = ({ payload }: FormValues) => {
    if (!metadata) return;

    readFullState(metadata, getSubmitPayload(payload) || '0x');
  };

  return (
    <Form initialValues={INITIAL_VALUES} onSubmit={handleSubmit}>
      {(form) => (
        <form id="state" onSubmit={form.handleSubmit}>
          <Box className={styles.box}>
            <Input label="Program ID:" gap="1/5" value={programId} readOnly />

            {isMetadataReady ? (
              payloadFormValues && <FormPayload name="payload" label="Payload" values={payloadFormValues} gap="1/5" />
            ) : (
              <Textarea label="Payload:" gap="1/5" className={styles.loading} block readOnly />
            )}

            <OnChange name="payload">{() => resetState()}</OnChange>

            {isStateRead ? (
              isState && (
                <Textarea label="Statedata:" rows={15} gap="1/5" value={getPreformattedText(state)} readOnly block />
              )
            ) : (
              <Textarea label="Statedata:" rows={15} gap="1/5" value="" className={styles.loading} readOnly block />
            )}
          </Box>

          <div className={styles.buttons}>
            {isMetadataReady && (
              <Button type="submit" form="state" color="secondary" text="Read" icon={ReadSVG} size="large" />
            )}

            {isStateRead && isState && (
              <Button text="Download JSON" color="secondary" size="large" onClick={() => downloadJson(state)} />
            )}

            <BackButton />
          </div>
        </form>
      )}
    </Form>
  );
};

export { Full };
