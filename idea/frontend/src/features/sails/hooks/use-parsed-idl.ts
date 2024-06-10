import { HexString } from '@gear-js/api';
import { useApi } from '@gear-js/react-hooks';
import { useQuery } from '@tanstack/react-query';
import { Sails } from 'sails-js';

import rmrkCatalogUrl from '../assets/rmrk-catalog.idl?url';
import rmrkResourceUrl from '../assets/rmrk-resource.idl?url';
import thisThatSvcUrl from '../assets/this-that-svc.idl?url';
import ftUrl from '../assets/ft.idl?url';

import { useIdl } from './use-idl';

function useParsedIdl(programId: HexString) {
  const { api, isApiReady } = useApi();
  const idl = useIdl(ftUrl);

  const { data } = useQuery({
    queryKey: ['parsedIdl'],

    queryFn: async () => {
      if (!api) throw new Error('API not initialized');
      if (!idl) throw new Error('IDL not found');

      const sails = (await Sails.new()).setApi(api).setProgramId(programId);
      const parsedIdl = sails.parseIdl(idl);

      return { sails, idl: parsedIdl };
    },

    enabled: isApiReady && Boolean(idl),
  });

  return data || { sails: undefined, idl: undefined };
}

export { useParsedIdl };
