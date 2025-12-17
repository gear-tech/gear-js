import { HexString } from '@gear-js/api';
import { getVaraAddress, useProgram, useProgramQuery } from '@gear-js/react-hooks';
import { Checkbox } from '@gear-js/ui';
import { useMemo, useState } from 'react';

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

const getVftEvent = (payload: unknown) => {
  if (
    typeof payload !== 'object' ||
    payload === null ||
    !('value' in payload) ||
    (typeof payload.value !== 'string' && typeof payload.value !== 'bigint' && typeof payload.value !== 'number')
  ) {
    return { type: 'unknown' as const, payload };
  }

  if (
    'owner' in payload &&
    typeof payload.owner === 'string' &&
    'spender' in payload &&
    typeof payload.spender === 'string'
  ) {
    return { type: 'approve' as const, payload: payload as ApproveEvent };
  }

  if ('from' in payload && typeof payload.from === 'string' && 'to' in payload && typeof payload.to === 'string') {
    return { type: 'transfer' as const, payload: payload as TransferEvent };
  }

  if ('from' in payload && typeof payload.from === 'string') {
    return { type: 'burn' as const, payload: payload as BurnEvent };
  }

  if ('to' in payload && typeof payload.to === 'string') {
    return { type: 'mint' as const, payload: payload as MintEvent };
  }

  return { type: 'unknown' as const, payload };
};

function VftEventPayload({ decodedPayload, programId }: { decodedPayload: unknown; programId: HexString }) {
  const [isRaw, setIsRaw] = useState(false);

  const { data: program } = useProgram({ library: SailsProgram, id: programId });

  const { data: decimals } = useProgramQuery({
    program,
    serviceName: 'vft',
    functionName: 'decimals',
    args: [],
  });

  const parsedPayload = useMemo(() => {
    const { type, payload } = getVftEvent(decodedPayload);

    if (isUndefined(decimals) || type === 'unknown') return payload;

    const value = formatUnits(BigInt(payload.value), decimals);

    switch (type) {
      case 'approve':
        return { ...payload, owner: getVaraAddress(payload.owner), spender: getVaraAddress(payload.spender), value };

      case 'transfer':
        return { ...payload, from: getVaraAddress(payload.from), to: getVaraAddress(payload.to), value };

      case 'burn':
        return { ...payload, from: getVaraAddress(payload.from), value };

      case 'mint':
        return { ...payload, to: getVaraAddress(payload.to), value };

      default:
        return payload;
    }
  }, [decimals, decodedPayload]);

  return (
    <>
      <Checkbox label="Raw" checked={isRaw} onChange={() => setIsRaw((prevValue) => !prevValue)} />
      <PreformattedBlock text={isRaw ? decodedPayload : parsedPayload} />
    </>
  );
}

export { VftEventPayload };
