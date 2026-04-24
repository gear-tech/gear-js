import { useMemo, useState } from 'react';
import { type Address, type Hex, isAddress } from 'viem';

import { SplitButton } from '@/components';
import { Input } from '@/components/form/input';
import type { SplitButtonOption } from '@/components/ui/split-button';

import { useCreateProgram } from '../../lib';
import styles from './create-program-button.module.scss';

type Props = {
  codeId: Hex;
};

const CreateProgramMode = {
  DEFAULT: 'default',
  WITH_ABI: 'withAbi',
} as const;

type CreateProgramMode = (typeof CreateProgramMode)[keyof typeof CreateProgramMode];

const CreateProgramButton = ({ codeId }: Props) => {
  const createProgram = useCreateProgram();
  const [selectedOption, setSelectedOption] = useState<CreateProgramMode>(CreateProgramMode.DEFAULT);
  const [abiAddress, setAbiAddress] = useState('');

  const normalizedAbiAddress = abiAddress.trim();
  const hasAbiAddress = normalizedAbiAddress.length > 0;
  const isValidAbiAddress = isAddress(normalizedAbiAddress);
  const isAbiMode = selectedOption === CreateProgramMode.WITH_ABI;
  const isWithAbiDisabled = !isValidAbiAddress;
  const abiAddressError = hasAbiAddress && !isValidAbiAddress ? 'Invalid address format' : undefined;

  const options = useMemo(
    () =>
      [
        {
          value: CreateProgramMode.DEFAULT,
          label: 'Create program',
          description: 'Create program from code ID',
        },
        {
          value: CreateProgramMode.WITH_ABI,
          label: 'Create program with ABI',
          description: 'Create program with ABI contract address',
          disabled: isWithAbiDisabled,
        },
      ] as const satisfies readonly SplitButtonOption<CreateProgramMode>[],
    [isWithAbiDisabled],
  );
  const isPrimaryDisabled = createProgram.isPending || (isAbiMode && !isValidAbiAddress);

  const handleCreate = () => {
    if (isAbiMode) {
      if (!isValidAbiAddress) return;
      createProgram.mutate({
        codeId,
        abiAddress: normalizedAbiAddress as Address,
      });
      return;
    }

    createProgram.mutate({ codeId });
  };

  return (
    <SplitButton
      options={options}
      selectedValue={selectedOption}
      primaryDisabled={isPrimaryDisabled}
      isLoading={createProgram.isPending}
      primaryButtonProps={{
        type: 'button',
        onClick: handleCreate,
      }}
      menuContent={
        <div className={styles.abiInputWrapper}>
          <Input
            value={abiAddress}
            onChange={(event) => setAbiAddress(event.target.value)}
            placeholder="ABI contract address"
            className={styles.abiInput}
            disabled={createProgram.isPending}
            error={abiAddressError}
          />
        </div>
      }
      triggerAriaLabel="Select create mode"
      onOptionClick={setSelectedOption}>
      {isAbiMode ? 'Create with ABI' : 'Create program'}
    </SplitButton>
  );
};

export { CreateProgramButton };
