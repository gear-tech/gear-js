import { useApi } from '@gear-js/react-hooks';

import { DNS_API_URL, DNS_PROGRAM_QUERY_KEY, Program } from '../consts';
import { useQuery } from '@tanstack/react-query';

const useInitDnsProgram = () => {
  const { isApiReady, api } = useApi();

  const getDnsProgram = () =>
    fetch(`${DNS_API_URL}/dns/contract`).then((response) => {
      return response.json().then(({ contract }) => {
        const programId = contract;
        if (isApiReady) {
          return new Program(api, programId);
        }
      });
    });

  const { data, isPending } = useQuery({
    queryKey: DNS_PROGRAM_QUERY_KEY,
    queryFn: getDnsProgram,
    enabled: isApiReady,
  });

  const isLoading = isPending;

  return { data, isLoading };
};

export { useInitDnsProgram };
