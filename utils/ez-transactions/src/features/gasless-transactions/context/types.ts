import { HexString } from '@gear-js/api';

export type GaslessContext = {
  voucherId: HexString | undefined;
  isLoading: boolean;
  isEnabled: boolean;
  isActive: boolean;
  voucherStatus: VoucherStatus | null;
  expireTimestamp: number | null;
  requestVoucher: (accountAddress: string) => Promise<`0x${string}`>;
  setIsEnabled: (value: boolean) => void;
};

export type VoucherStatus = {
  id: string;
  enabled: boolean;
  duration: number;
  varaToIssue: number;
};
