import type { HexString } from '@gear-js/api';
import { useAccount, useAlert } from '@gear-js/react-hooks';
import type { PayloadValue } from '@gear-js/sails-payload-form';
import { Button, Input, Textarea } from '@gear-js/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AnyJson } from '@polkadot/types/types';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { useProgram } from '@/features/program';
import { PayloadForm, useSails, useService } from '@/features/sails';
import type { ParsedSails } from '@/features/sails/types';
import ReadSVG from '@/shared/assets/images/actions/read.svg?react';
import { getPreformattedText, isUndefined } from '@/shared/helpers';
import { BackButton } from '@/shared/ui/backButton';
import { Box } from '@/shared/ui/box';

import { downloadJson } from '../../helpers';
import { useProgramId } from '../../hooks';
import { INITIAL_VALUES } from '../../model';
import styles from '../full/Full.module.scss';

const StateForm = ({ programId, program }: { programId: HexString; program: ParsedSails }) => {
  const { account } = useAccount();
  const alert = useAlert();

  program.setProgramId(programId);

  const { select, functionSelect, args, serviceName, callQuery, ...query } = useService(program, 'queries');

  const defaultValues = { ...INITIAL_VALUES, payload: query.defaultValues };
  const schema = query.schema ? z.object({ payload: query.schema }) : undefined;
  const form = useForm({ values: defaultValues, resolver: schema ? zodResolver(schema) : undefined });
  // take a look at: https://github.com/react-hook-form/react-hook-form/issues/7068,
  // works for now but might need to be changed, form.watch for example is not working
  const payloadValue = useWatch({ control: form.control, name: 'payload' });

  const readQuery = async (payload: PayloadValue | undefined): Promise<AnyJson> => {
    if (!callQuery) throw new Error('Query is not found');
    if (!account?.decodedAddress) throw new Error('Account is not connected');

    return (await callQuery(payload as Record<string, unknown>, account?.decodedAddress)) as AnyJson;
  };

  const state = useMutation({ mutationFn: readQuery, onError: ({ message }) => alert.error(message) });
  const isStateExists = !isUndefined(state.data);

  const handleSubmit = form.handleSubmit(({ payload }) => state.mutate(payload));

  useEffect(() => {
    state.reset();
  }, [payloadValue]);

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit}>
        <Box className={styles.box}>
          <Input label="Program ID:" gap="1/5" value={programId} readOnly />

          {args && (
            <PayloadForm
              gap="1/5"
              program={program}
              serviceName={serviceName}
              select={select}
              functionSelect={functionSelect}
              args={args}
            />
          )}

          {state.isPending ? (
            <Textarea label="Statedata:" rows={15} gap="1/5" value="" className={styles.loading} readOnly block />
          ) : (
            isStateExists && (
              <Textarea label="Statedata:" rows={15} gap="1/5" value={getPreformattedText(state.data)} readOnly block />
            )
          )}
        </Box>

        <div className={styles.buttons}>
          <Button type="submit" color="secondary" text="Read" icon={ReadSVG} size="large" />

          {!state.isPending && isStateExists && (
            <Button text="Download JSON" color="secondary" size="large" onClick={() => downloadJson(state.data)} />
          )}

          <BackButton />
        </div>
      </form>
    </FormProvider>
  );
};

const Sails = () => {
  const programId = useProgramId();
  const { data: program } = useProgram(programId);
  const { sails } = useSails(program?.codeId, programId);

  return (
    <>
      <h2 className={styles.heading}>Read Program State</h2>
      {sails ? <StateForm programId={programId} program={sails} /> : null}
    </>
  );
};

export { Sails };
