import type { ISailsFuncArg } from '@gear-js/sails-payload-form';
import { useQuery } from '@tanstack/react-query';
import type { Hex } from 'viem';

import type { ParsedSails } from './parse-idl';
import { useSailsInit } from './use-sails-init';

const useSails = (idl: string | null) => {
  const parseIdl = useSailsInit();

  return useQuery({
    queryKey: ['initSails', idl],
    queryFn: () => {
      if (!idl) throw new Error('IDL is required to initialize Sails');
      if (!parseIdl) throw new Error('Sails parser is not initialized');

      return parseIdl(idl);
    },
    enabled: Boolean(idl && parseIdl),
  });
};

type FormattedPayloadValue = {
  encoded: Hex;
  formatted: string;
};

type SailsAction = {
  id: string;
  name: string;
  action: string;
  serviceName?: string;
  args: ISailsFuncArg[];
  isEnabled?: boolean;
  requiresAccount?: boolean;
  tooltip?: string;
  encode: (...params: unknown[]) => Hex;
  onSubmit: (payload: FormattedPayloadValue) => Promise<unknown>;
  splitAction?: {
    selectedValue: string;
    options: readonly { value: string; label: string; description?: string }[];
    onOptionClick: (value: string) => void;
  };
};

export type { FormattedPayloadValue, ParsedSails, SailsAction };
export { useSails };
