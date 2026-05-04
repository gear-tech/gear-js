import type { NodeSection } from '@/entities/node';
import { NODES_API_URL } from '@/shared/config';

import { INFINITE_QUERY } from './consts';
import type { PaginationParameters, PaginationResponse } from './types';

const getNodes = () => fetch(NODES_API_URL).then((result) => result.json() as unknown as NodeSection[]);

export type { PaginationParameters, PaginationResponse };
export { getNodes, INFINITE_QUERY };
