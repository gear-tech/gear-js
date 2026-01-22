import {
  getDefaultPayloadValue,
  getPayloadSchema,
  getResetPayloadValue,
  ISailsFuncArg,
  PayloadValue,
} from '@gear-js/sails-payload-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HexString } from '@vara-eth/api';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Sails } from 'sails-js';
import { z } from 'zod';

import { Button, ExpandableItem } from '@/components';
import { SailsPayloadFields } from '@/features/sails';

import { useInitProgram } from '../../lib';

type Props = {
  programId: HexString;
  ctorName: string;
  sails: Sails;
  args: ISailsFuncArg[];
  onInit: () => void;
  idl: string;
};

type Values = { payload: PayloadValue };
type FormattedValues = { payload: HexString };

const InitForm = ({ programId, sails, ctorName, args, onInit, idl }: Props) => {
  const { mutate: initProgram, isPending: isInitPending } = useInitProgram(programId, idl);

  const defaultValues = useMemo(() => ({ payload: getDefaultPayloadValue(sails, args) }), [sails, args]);

  const schema = useMemo(
    () => z.object({ payload: getPayloadSchema(sails, args, sails.ctors[ctorName].encodePayload) }),
    [sails, args, ctorName],
  );

  const form = useForm<Values, unknown, FormattedValues>({
    values: defaultValues,
    resolver: zodResolver(schema),
  });

  const onSuccess = () => {
    const values = form.getValues();
    const resetValue = { payload: getResetPayloadValue(values.payload) };

    form.reset(resetValue);
    onInit();
  };

  const handleSubmitForm = form.handleSubmit(({ payload }) => {
    initProgram({ ctorName, payload }, { onSuccess });
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmitForm}>
        <ExpandableItem
          key={ctorName}
          header={ctorName}
          isNested
          headerSlot={
            <Button variant="default" size="xs" isLoading={isInitPending} type="submit">
              Initialize
            </Button>
          }>
          <SailsPayloadFields sails={sails} args={args} />
        </ExpandableItem>
      </form>
    </FormProvider>
  );
};

export { InitForm };
