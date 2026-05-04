import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { type Address, type Hex, isAddress, parseUnits } from 'viem';

import { useWrappedVaraBalance } from '@/app/api';
import { ChainEntity, Checkbox, Input, Skeleton } from '@/components';
import { Button } from '@/components/ui/button';
import { useGetCodeByIdQuery } from '@/features/codes/lib/queries';
import { type CreateProgramParams, useCreateProgram } from '@/features/programs/lib';

import styles from './create-program.module.scss';
import { type CreateProgramFormValues, createProgramFormDefaultValues, createProgramFormSchema } from './schema';

type Params = {
  codeId: Hex;
};

const CreateProgram = () => {
  const { codeId } = useParams() as Params;
  const { data: code, isLoading } = useGetCodeByIdQuery(codeId);
  const createProgram = useCreateProgram();
  const { value: wvaraBalance, decimals, isPending: isWvaraPending } = useWrappedVaraBalance();

  const form = useForm<CreateProgramFormValues>({
    defaultValues: createProgramFormDefaultValues,
    resolver: zodResolver(createProgramFormSchema),
  });

  const { handleSubmit, watch } = form;
  const useExecutableBalance = watch('useExecutableBalance');
  const useAbiInterface = watch('useAbiInterface');
  const useOverrideInitializer = watch('useOverrideInitializer');

  const onSubmit = (values: CreateProgramFormValues) => {
    let executableBalanceWei: bigint | undefined;
    if (values.useExecutableBalance) {
      if (decimals === undefined) return;

      try {
        executableBalanceWei = parseUnits(values.amount.trim(), decimals);
      } catch {
        form.setError('amount', { type: 'custom', message: 'Invalid amount' });
        return;
      }

      if (wvaraBalance === undefined) {
        form.setError('amount', { type: 'custom', message: 'Unable to fetch WVARA balance' });
        return;
      }

      if (executableBalanceWei > wvaraBalance) {
        form.setError('amount', { type: 'custom', message: 'Insufficient WVARA balance' });
        return;
      }
    }

    const abiTrim = values.abiInterface.trim();
    const overrideTrim = values.overrideInitializer.trim();

    const params: CreateProgramParams = {
      codeId,
      useExecutableBalance: values.useExecutableBalance,
      executableBalanceWei,
      abiInterface: values.useAbiInterface && isAddress(abiTrim) ? (abiTrim as Address) : undefined,
      overrideInitializer:
        values.useOverrideInitializer && isAddress(overrideTrim) ? (overrideTrim as Address) : undefined,
    };

    createProgram.mutate(params);
  };

  const isSubmitDisabled =
    createProgram.isPending || (useExecutableBalance && (decimals === undefined || isWvaraPending));

  if (!isLoading && !code) {
    return <ChainEntity.NotFound entity="code" id={codeId} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <ChainEntity.Header>
          <ChainEntity.BackButton />
          <ChainEntity.Title id={codeId} />
        </ChainEntity.Header>

        <h1 className={styles.title}>Enter program parameters</h1>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.section}>
              <Checkbox name="useExecutableBalance" label="Executable balance" />

              {useExecutableBalance && (
                <div className={styles.sectionNested}>
                  {isWvaraPending ? (
                    <Skeleton width="8rem" />
                  ) : (
                    <Input name="amount" type="number" min={0} step="any" label="Amount (WVARA)" />
                  )}
                </div>
              )}
            </div>

            <div className={styles.section}>
              <Checkbox name="useAbiInterface" label="ABI interface contract" />
              {useAbiInterface && (
                <div className={styles.sectionNested}>
                  <Input name="abiInterface" placeholder="0x…" />
                </div>
              )}
            </div>

            <div className={styles.section}>
              <Checkbox name="useOverrideInitializer" label="Override initializer" />
              {useOverrideInitializer && (
                <div className={styles.sectionNested}>
                  <Input name="overrideInitializer" placeholder="0x…" />
                </div>
              )}
            </div>

            <div className={styles.actions}>
              <Button type="submit" size="xs" disabled={isSubmitDisabled} isLoading={createProgram.isPending}>
                Create program
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export { CreateProgram };
