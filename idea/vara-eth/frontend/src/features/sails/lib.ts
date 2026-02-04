import { ISailsFuncArg } from '@gear-js/sails-payload-form';
import { useQuery } from '@tanstack/react-query';
import { HexString } from '@vara-eth/api';
import { Sails } from 'sails-js';
import { SailsIdlParser } from 'sails-js-parser';

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
  encoded: HexString;
  formatted: string;
};

type SailsAction = {
  id: string;
  name: string;
  action: string;
  args: ISailsFuncArg[];
  isEnabled?: boolean;
  encode: (...params: unknown[]) => HexString;
  onSubmit: (payload: FormattedPayloadValue) => Promise<unknown>;
};

export { useSails };
export type { SailsAction, FormattedPayloadValue };
