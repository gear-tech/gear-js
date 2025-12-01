import { useQuery } from '@tanstack/react-query';
import { request } from 'graphql-request';

import { EXPLORER_URL } from '@/shared/config';
import { graphql } from '@/shared/graphql';

const GET_PROGRAMS_QUERY = graphql(`
  query GetPrograms($first: Int!, $offset: Int!) {
    allPrograms(first: $first, offset: $offset) {
      nodes {
        id
        codeId
        createdAtBlock
        createdAtTx
      }
      totalCount
    }
  }
`);

export const useGetAllProgramsQuery = (page: number, pageSize: number) => {
  const first = pageSize;
  const offset = (page - 1) * pageSize;

  return useQuery({
    queryKey: ['allPrograms', first, offset],
    queryFn: async () => {
      const result = await request(EXPLORER_URL, GET_PROGRAMS_QUERY, { first, offset });
      return result;
    },
    select: (data) => data?.allPrograms,
    placeholderData: (previousData) => previousData,
  });
};
