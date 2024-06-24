import { HexString } from '@gear-js/api';
import { useAccount, useAlert, useApi } from '@gear-js/react-hooks';
import { Button, Input, Textarea } from '@gear-js/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnyJson } from '@polkadot/types/types';
import { useMutation } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';
import { Sails as SailsType, ZERO_ADDRESS } from 'sails-js';
import { z } from 'zod';

import { useProgram } from '@/hooks';
import { getPreformattedText, isUndefined } from '@/shared/helpers';
import { BackButton } from '@/shared/ui/backButton';
import { Box } from '@/shared/ui/box';
import ReadSVG from '@/shared/assets/images/actions/read.svg?react';
import { useQuery } from '@/features/sails/hooks/payload/use-query';
import { PayloadForm, PayloadValue, useSails } from '@/features/sails';

import { INITIAL_VALUES } from '../../model';
import { downloadJson } from '../../helpers';
import { useProgramId } from '../../hooks';
import styles from '../full/Full.module.scss';

// TODO: would be better if useQuery (useService) could accept undefined sails?
// TODO: reset on value change?
const StateForm = ({ programId, sails }: { programId: HexString; sails: SailsType }) => {
  const { api } = useApi();
  const { account } = useAccount();
  const alert = useAlert();
  const { select, functionSelect, args, decodePayload, ...query } = useQuery(sails);

  const defaultValues = { ...INITIAL_VALUES, payload: query.defaultValues };
  const schema = query.schema ? z.object({ payload: query.schema }) : undefined;
  const form = useForm({ values: defaultValues, resolver: schema ? zodResolver(schema) : undefined });

  const readQuery = async (payload: PayloadValue | undefined): Promise<AnyJson> => {
    if (!api) throw new Error('API is not initialized');
    if (!decodePayload) throw new Error('Sails is not found');

    const result = await api.message.calculateReply({
      destination: programId,
      origin: account?.decodedAddress || ZERO_ADDRESS,
      value: 0,
      gasLimit: api.blockGasLimit.toBigInt(),
      payload,
    });

    return decodePayload(result.payload.toHex());
  };

  // TODO: decode numbers bigger than 64 bits (BigInt)
  const state = useMutation({ mutationFn: readQuery, onError: ({ message }) => alert.error(message) });
  const isStateExists = !isUndefined(state.data);

  const handleSubmit = form.handleSubmit(({ payload }) => state.mutate(payload));

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit}>
        <Box className={styles.box}>
          <Input label="Program ID:" gap="1/5" value={programId} readOnly />

          {sails && args && (
            <PayloadForm gap="1/5" sails={sails} select={select} functionSelect={functionSelect} args={args} />
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
  const { program } = useProgram(programId);
  const { sails } = useSails(program?.codeId);

  return sails ? <StateForm programId={programId} sails={sails} /> : null;
};

export { Sails };
