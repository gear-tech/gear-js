import { NodeSection } from '@/entities/node';
import { NODES_API_URL } from '@/shared/config';

import { fetchMetadata, addMetadata } from './metadata';
import { PaginationParameters, PaginationResponse } from './types';
import { INFINITE_QUERY } from './consts';

const getNodes = () => fetch(NODES_API_URL).then((result) => result.json() as unknown as NodeSection[]);

export { INFINITE_QUERY, getNodes, addMetadata, fetchMetadata };

export type { PaginationParameters, PaginationResponse };
