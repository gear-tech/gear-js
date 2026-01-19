import { zodResolver } from '@hookform/resolvers/zod';
import { HexString } from '@vara-eth/api';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Sails } from 'sails-js';

import { Button, ExpandableItem } from '@/components';
import { Fields } from '@/features/sails';

import { PayloadValue, useInitProgram } from '../../lib';
import { ISailsFuncArg } from '../../lib/types';
import { getDefaultPayloadValue, getPayloadSchema } from '../../lib/utils';

type Props = {
  programId: HexString;
  ctorName: string;
  sails: Sails;
  args: ISailsFuncArg[];
  onInit: () => void;
  idl: string;
};

type Values = {
  [k: string]: PayloadValue;
};

const InitForm = ({ programId, sails, ctorName, args, onInit, idl }: Props) => {
  const { initProgram, isPending: isInitPending } = useInitProgram(programId, idl);

  const defaultValues = useMemo(() => getDefaultPayloadValue(sails, args), [sails, args]);

  const schema = useMemo(() => getPayloadSchema(sails, args), [sails, args]);

  const form = useForm<Values, unknown, unknown[]>({
    values: defaultValues,
    resolver: zodResolver(schema),
  });

  const onSuccess = () => {
    form.reset(defaultValues);
    onInit();
  };

  const handleSubmitForm = form.handleSubmit((formValues) => {
    initProgram({ ctorName, args: formValues }, { onSuccess });
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
          <Fields sails={sails} args={args} />
        </ExpandableItem>
      </form>
    </FormProvider>
  );
};

export { InitForm };
