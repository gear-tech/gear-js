import type { ISailsFuncArg } from '@gear-js/sails-payload-form';
import { useQuery } from '@tanstack/react-query';
import { Sails } from 'sails-js';
import { SailsIdlParser } from 'sails-js-parser';
import type { Hex } from 'viem';

const useSails = (idl: string | null) => {
  const initSails = async () => {
    if (!idl) throw new Error('IDL is required to initialize Sails');

    const parser = new SailsIdlParser();
    const sails = new Sails(parser);

    await parser.init();
    sails.parseIdl(idl);

    return sails;
  };

  return useQuery({
    queryKey: ['initSails', idl],
    queryFn: initSails,
    enabled: !!idl,
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

export type { FormattedPayloadValue, SailsAction };
export { useSails };
