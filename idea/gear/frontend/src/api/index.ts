import { NodeSection } from '@/entities/node';
import { NODES_API_URL } from '@/shared/config';

import { INFINITE_QUERY } from './consts';
import { PaginationParameters, PaginationResponse } from './types';

const getNodes = () => fetch(NODES_API_URL).then((result) => result.json() as unknown as NodeSection[]);

export { INFINITE_QUERY, getNodes };

export type { PaginationParameters, PaginationResponse };
