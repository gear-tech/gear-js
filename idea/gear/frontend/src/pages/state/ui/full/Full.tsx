import { Button, Input, Textarea } from '@gear-js/ui';
import { useEffect, useMemo } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import { FormPayload, getPayloadFormValues, getSubmitPayload } from '@/features/formPayload';
import { isHumanTypesRepr, useMetadata } from '@/features/metadata';
import { useProgram } from '@/features/program';
import { useStateRead } from '@/hooks';
import ReadSVG from '@/shared/assets/images/actions/read.svg?react';
import { getPreformattedText, isNullOrUndefined } from '@/shared/helpers';
import { BackButton } from '@/shared/ui/backButton';
import { Box } from '@/shared/ui/box';

import { downloadJson } from '../../helpers';
import { useProgramId } from '../../hooks';
import { FormValues, INITIAL_VALUES } from '../../model';

import styles from './Full.module.scss';

const Full = () => {
  const programId = useProgramId();

  const { data: program } = useProgram(programId);
  const { metadata, isMetadataReady } = useMetadata(program?.metahash);
  const { state, isStateRead, isState, readFullState, resetState } = useStateRead(programId);

  const methods = useForm<FormValues>({ defaultValues: INITIAL_VALUES });
  const { control } = methods;
  const payloadValue = useWatch({ control, name: 'payload' });

  useEffect(() => {
    resetState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payloadValue]);

  const payloadFormValues = useMemo(
    () =>
      metadata && isHumanTypesRepr(metadata.types.state) && !isNullOrUndefined(metadata.types.state.input)
        ? getPayloadFormValues(metadata, metadata.types.state.input)
        : undefined,
    [metadata],
  );

  const handleSubmit = ({ payload }: FormValues) => {
    if (!metadata) return;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- TODO(#1800): resolve eslint comments
    readFullState(metadata, getSubmitPayload(payload) || '0x');
  };

  return (
    <>
      <h2 className={styles.heading}>Read Program State</h2>

      <FormProvider {...methods}>
        <form id="state" onSubmit={methods.handleSubmit(handleSubmit)}>
          <Box className={styles.box}>
            <Input label="Program ID:" gap="1/5" value={programId} readOnly />

            {isMetadataReady ? (
              payloadFormValues && <FormPayload name="payload" label="Payload" values={payloadFormValues} gap="1/5" />
            ) : (
              <Textarea label="Payload:" gap="1/5" className={styles.loading} block readOnly />
            )}

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
      </FormProvider>
    </>
  );
};

export { Full };
