import { zodResolver } from '@hookform/resolvers/zod';
import { HexString } from 'gearexe';
import { useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Sails } from 'sails-js';

import { Button, Input, ExpandableItem } from '@/components';

import { PayloadValue } from '../../lib';
import { ISailsFuncArg } from '../../lib/types';
import { useInitProgram } from '../../lib/use-init-program';
import { getDefaultPayloadValue, getPayloadSchema } from '../../lib/utils';

type Props = {
  programId: HexString;
  ctorName: string;
  sails: Sails;
  args: ISailsFuncArg[];
  onInit: () => void;
};

type Values = {
  [k: string]: PayloadValue;
};

const InitForm = ({ programId, sails, ctorName, args, onInit }: Props) => {
  const { initProgram, isPending: isInitPending } = useInitProgram(programId);

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
          {args.map((param) => (
            // TODO: use fields from idea\gear\frontend\src\features\sails\ui\fields
            <Input key={param.name} placeholder="0x" {...form.register(param.name)} />
          ))}
        </ExpandableItem>
      </form>
    </FormProvider>
  );
};

export { InitForm };
