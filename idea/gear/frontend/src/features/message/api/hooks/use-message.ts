import { HexString } from '@gear-js/api';
import { useQuery } from '@tanstack/react-query';

import { getMessageFromProgram, getMessageToProgram } from '../requests';

function useMessageToProgram(id: HexString) {
  return useQuery({
    queryKey: ['messageToProgram', id],
    queryFn: async () => (await getMessageToProgram(id)).result,
  });
}

function useMessageFromProgram(id: HexString) {
  return useQuery({
    queryKey: ['messageFromProgram', id],
    queryFn: async () => (await getMessageFromProgram(id)).result,
  });
}

export { useMessageToProgram, useMessageFromProgram };
