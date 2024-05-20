import { HexString } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { useQuery } from '@tanstack/react-query';
import { Sails } from 'sails-js';

import { useIdl } from './use-idl';

function useParsedIdl(programId: HexString) {
  const { api, isApiReady } = useApi();
  const idl = useIdl();

  const { data } = useQuery({
    queryKey: ['parsedIdl'],

    queryFn: async () => {
      if (!api) throw new Error('API not initialized');
      if (!idl) throw new Error('IDL not found');

      const sails = (await Sails.new()).setApi(api).setProgramId(programId);

      return { sails, idl: sails.parseIdl(idl) };
    },

    enabled: isApiReady && Boolean(idl),
  });

  return data || { sails: undefined, idl: undefined };
}

export { useParsedIdl };
