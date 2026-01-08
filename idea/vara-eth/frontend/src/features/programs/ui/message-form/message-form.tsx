import { zodResolver } from '@hookform/resolvers/zod';
import { HexString } from '@vara-eth/api';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Sails } from 'sails-js';

import { Button, Input, ExpandableItem } from '@/components';

import { PayloadValue, useSendInjectedTransaction, useSendProgramMessage } from '../../lib';
import { ISailsFuncArg } from '../../lib/types';
import { getDefaultPayloadValue, getPayloadSchema } from '../../lib/utils';

import styles from './message-form.module.scss';

type Props = {
  programId: HexString;
  serviceName: string;
  messageName: string;
  isQuery: boolean;
  sails: Sails;
  args: ISailsFuncArg[];
  isOffchain: boolean;
};

type Values = {
  [k: string]: PayloadValue;
};

const MessageForm = ({ programId, isQuery, sails, serviceName, messageName, args, isOffchain }: Props) => {
  // TODO: add IDL
  const { sendInjectedTransaction, isPending: isPendingInjectedTransaction } = useSendInjectedTransaction(programId);
  const { sendMessage, isPending: isPendingMessage } = useSendProgramMessage(programId);

  const defaultValues = useMemo(() => getDefaultPayloadValue(sails, args), [sails, args]);

  const schema = useMemo(() => getPayloadSchema(sails, args), [sails, args]);

  const form = useForm<Values, unknown, unknown[]>({ values: defaultValues, resolver: zodResolver(schema) });

  const resetForm = () => {
    form.reset(defaultValues);
  };

  const handleSubmitForm = form.handleSubmit((formValues) => {
    const send = isOffchain ? sendInjectedTransaction : sendMessage;
    send({ serviceName, messageName, args: formValues, isQuery }, { onSuccess: resetForm });
  });

  const formName = `${serviceName}-${messageName}-form`;

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmitForm} id={formName}>
        <ExpandableItem
          key={messageName}
          header={messageName}
          isNested
          headerSlot={
            <Button
              type="submit"
              variant="default"
              form={formName}
              size="xs"
              isLoading={isPendingInjectedTransaction || isPendingMessage}
              className={styles.button}>
              {isQuery ? 'Read' : 'Write'}
            </Button>
          }>
          {args.map((param) => {
            return (
              // TODO: use fields from idea\gear\frontend\src\features\sails\ui\fields
              <Input key={param.name} name={param.name} placeholder="0x" />
            );
          })}
        </ExpandableItem>
      </form>
    </FormProvider>
  );
};

export { MessageForm };
