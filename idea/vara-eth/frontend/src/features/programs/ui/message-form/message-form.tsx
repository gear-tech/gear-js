import { zodResolver } from '@hookform/resolvers/zod';
import { HexString } from '@vara-eth/api';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Sails } from 'sails-js';
import { z } from 'zod';

import { Button, ExpandableItem } from '@/components';
import { SailsPayloadFields } from '@/features/sails';
import { ISailsFuncArg, PayloadValue } from '@/features/sails/types';
import { getDefaultPayloadValue, getPayloadSchema, getResetPayloadValue } from '@/features/sails/utils';

import { useSendInjectedTransaction, useSendProgramMessage } from '../../lib';

import styles from './message-form.module.scss';

type Props = {
  programId: HexString;
  serviceName: string;
  messageName: string;
  isQuery: boolean;
  sails: Sails;
  args: ISailsFuncArg[];
  idl: string;
  isOffchain: boolean;
};

type Values = { payload: PayloadValue };
type FormattedValues = { payload: HexString };

const MessageForm = ({ programId, isQuery, sails, serviceName, messageName, args, idl, isOffchain }: Props) => {
  const { mutate: sendInjectedTransaction, isPending: isPendingInjectedTransaction } = useSendInjectedTransaction(
    programId,
    idl,
  );

  const { mutate: sendMessage, isPending: isPendingMessage } = useSendProgramMessage(programId, idl);

  const defaultValues = useMemo(() => ({ payload: getDefaultPayloadValue(sails, args) }), [sails, args]);

  const encodePayload = useMemo(
    () => sails.services[serviceName][isQuery ? 'queries' : 'functions'][messageName].encodePayload,
    [sails, serviceName, messageName, isQuery],
  );

  const schema = useMemo(
    () => z.object({ payload: getPayloadSchema(sails, args, encodePayload) }),
    [sails, args, encodePayload],
  );

  const form = useForm<Values, unknown, FormattedValues>({
    values: defaultValues,
    resolver: zodResolver(schema),
  });

  const resetForm = () => {
    const values = form.getValues();
    const resetValue = { payload: getResetPayloadValue(values.payload) };

    form.reset(resetValue);
  };

  const handleSubmitForm = form.handleSubmit(({ payload }) => {
    const send = isOffchain ? sendInjectedTransaction : sendMessage;

    send({ serviceName, messageName, isQuery, payload }, { onSuccess: resetForm });
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmitForm}>
        <ExpandableItem
          key={messageName}
          header={messageName}
          isNested
          headerSlot={
            <Button
              type="submit"
              variant="default"
              size="xs"
              isLoading={isPendingInjectedTransaction || isPendingMessage}
              className={styles.button}>
              {isQuery ? 'Read' : 'Write'}
            </Button>
          }>
          <SailsPayloadFields sails={sails} args={args} />
        </ExpandableItem>
      </form>
    </FormProvider>
  );
};

export { MessageForm };
