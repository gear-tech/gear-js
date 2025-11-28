import { useQuery } from '@tanstack/react-query';

import { graphqlClient } from '@/shared/utils';

export type CodeStatus = 'validation_requested' | 'validation_failed' | 'validated';

export type Code = {
  id: string;
  status: CodeStatus;
};

export type AllCodes = {
  nodes: Code[];
  totalCount: number;
};

type GetCodesVariables = {
  first: number;
  offset: number;
};

const GET_CODES_QUERY = `
  query GetCodes($first: Int!, $offset: Int!) {
    allCodes(first: $first, offset: $offset) {
      nodes {
        id
        status
      }
      totalCount
    }
  }
`;

export const useGetAllCodesQuery = (page: number, pageSize: number) => {
  const first = pageSize;
  const offset = (page - 1) * pageSize;

  return useQuery({
    queryKey: ['allCodes', first, offset],
    queryFn: () => graphqlClient.request<{ allCodes: AllCodes }, GetCodesVariables>(GET_CODES_QUERY, { first, offset }),
    select: (data) => data.allCodes,
    placeholderData: (previousData) => previousData,
  });
};
