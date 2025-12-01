import { useQuery } from '@tanstack/react-query';
import { request } from 'graphql-request';

import { EXPLORER_URL } from '@/shared/config';
import { graphql } from '@/shared/graphql';

export const CODE_STATUS = {
  VALIDATION_REQUESTED: 'validation_requested',
  VALIDATION_FAILED: 'validation_failed',
  VALIDATED: 'validated',
};

const GET_CODES_QUERY = graphql(`
  query GetCodes($first: Int!, $offset: Int!) {
    allCodes(first: $first, offset: $offset) {
      nodes {
        id
        status
      }
      totalCount
    }
  }
`);

export const useGetAllCodesQuery = (page: number, pageSize: number) => {
  const first = pageSize;
  const offset = (page - 1) * pageSize;

  return useQuery({
    queryKey: ['allCodes', first, offset],
    queryFn: () => request(EXPLORER_URL, GET_CODES_QUERY, { first, offset }),
    select: (data) => data.allCodes,
    placeholderData: (previousData) => previousData,
  });
};
