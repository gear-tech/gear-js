import { HexString } from '@gear-js/api';
import { getVaraAddress, useProgram, useProgramQuery } from '@gear-js/react-hooks';
import { Checkbox } from '@gear-js/ui';
import { useCallback, useMemo, useState } from 'react';

import { useErrorAlert } from '@/hooks';
import { isUndefined } from '@/shared/helpers';
import { PreformattedBlock } from '@/shared/ui';

import { SailsProgram, Vft } from '../../sails';

type ApproveEvent = Parameters<Parameters<Vft['subscribeToApprovalEvent']>[0]>[0];
type MintEvent = Parameters<Parameters<Vft['subscribeToMintedEvent']>[0]>[0];
type BurnEvent = Parameters<Parameters<Vft['subscribeToBurnedEvent']>[0]>[0];
type TransferEvent = Parameters<Parameters<Vft['subscribeToTransferEvent']>[0]>[0];

function formatUnits(value: bigint, decimals: number) {
  let display = value.toString();

  const negative = display.startsWith('-');
  if (negative) display = display.slice(1);

  display = display.padStart(decimals, '0');

  // eslint-disable-next-line prefer-const
  let [integer, fraction] = [display.slice(0, display.length - decimals), display.slice(display.length - decimals)];
  fraction = fraction.replace(/(0+)$/, '');
  return `${negative ? '-' : ''}${integer || '0'}${fraction ? `.${fraction}` : ''}`;
}

type Props = {
  name: string;
  decoded: unknown;
  programId: HexString;
};

function VftEventPayload({ name, decoded, programId }: Props) {
  const { data: program } = useProgram({ library: SailsProgram, id: programId });

  const { data: decimals, error } = useProgramQuery({
    program,
    serviceName: 'vft',
    functionName: 'decimals',
    args: [],
  });

  useErrorAlert(error);

  const [isRaw, setIsRaw] = useState(false);

  const parse = useCallback(
    (payload: { value: bigint | string | number }) => ({
      ...payload, // destructure to preserve potential new fields
      value: isUndefined(decimals) ? '...' : formatUnits(BigInt(payload.value), decimals),
    }),
    [decimals],
  );

  const parsed = useMemo(() => {
    switch (name) {
      case 'transfer': {
        const payload = decoded as TransferEvent;

        return { ...parse(payload), from: getVaraAddress(payload.from), to: getVaraAddress(payload.to) };
      }

      case 'approval': {
        const payload = decoded as ApproveEvent;

        return { ...parse(payload), owner: getVaraAddress(payload.owner), spender: getVaraAddress(payload.spender) };
      }

      case 'minted': {
        const payload = decoded as MintEvent;

        return { ...parse(payload), to: getVaraAddress(payload.to) };
      }

      case 'burned': {
        const payload = decoded as BurnEvent;

        return { ...parse(payload), from: getVaraAddress(payload.from) };
      }
    }
  }, [name, decoded, parse]);

  return (
    <>
      {parsed && <Checkbox label="Raw" checked={isRaw} onChange={() => setIsRaw((prevValue) => !prevValue)} />}
      <PreformattedBlock text={isRaw ? decoded : (parsed ?? decoded)} />
    </>
  );
}

export { VftEventPayload };
