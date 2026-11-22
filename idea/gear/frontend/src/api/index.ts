import type { NodeSection } from '@/entities/node';
import { isRetiredVaraTestnet, NODES_API_URL } from '@/shared/config';

import { INFINITE_QUERY } from './consts';
import type { PaginationParameters, PaginationResponse } from './types';

const getNodes = () =>
  fetch(NODES_API_URL)
    .then((result) => result.json() as unknown as NodeSection[])
    .then((sections) =>
      sections
        .filter(({ caption }) => !isRetiredVaraTestnet(caption))
        .map((section) => ({
          ...section,
          nodes: section.nodes.filter(({ address }) => !isRetiredVaraTestnet(address)),
        }))
        .filter(({ nodes }) => nodes.length > 0),
    );

export type { PaginationParameters, PaginationResponse };
export { getNodes, INFINITE_QUERY };
