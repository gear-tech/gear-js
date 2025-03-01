import { zodResolver } from '@hookform/resolvers/zod';
import { HexString } from 'gearexe';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Sails } from 'sails-js';

import { Button, Input, ExpandableItem } from '@/components';

import { PayloadValue, useSendProgramMessage } from '../../lib';
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
  encodePayload: (...args: unknown[]) => HexString;
};

type Values = {
  [k: string]: PayloadValue;
};

const MessageForm = ({ programId, isQuery, sails, serviceName, messageName, args, encodePayload }: Props) => {
  const { sendMessage, isPending } = useSendProgramMessage(programId);

  const defaultValues = useMemo(() => getDefaultPayloadValue(sails, args), [sails, args]);

  const schema = useMemo(() => getPayloadSchema(sails, args, encodePayload), [sails, args, encodePayload]);

  const form = useForm<Values, unknown, typeof schema>({ values: defaultValues, resolver: zodResolver(schema) });

  const resetForm = () => {
    form.reset(defaultValues);
  };

  const handleSubmitForm = form.handleSubmit(({ ...formValues }) => {
    // TODO: Check arguments order
    const formValuesArray = Object.values(formValues);
    sendMessage({ serviceName, functionName: messageName, args: formValuesArray }, { onSuccess: resetForm });
  });

  const formName = `${serviceName}-${messageName}-form`;

  return (
    <ExpandableItem
      key={messageName}
      header={messageName}
      isNested
      headerSlot={
        <Button variant="default" form={formName} size="xs" isLoading={isPending} className={styles.button}>
          {isQuery ? 'Read' : 'Write'}
        </Button>
      }>
      {args.map((param) => {
        return (
          <FormProvider {...form} key={param.name}>
            <form onSubmit={handleSubmitForm} id={formName}>
              {/* // TODO: use fields from idea\gear\frontend\src\features\sails\ui\fields */}
              <Input name={param.name} placeholder="0x" />
            </form>
          </FormProvider>
        );
      })}
    </ExpandableItem>
  );
};

export { MessageForm };
