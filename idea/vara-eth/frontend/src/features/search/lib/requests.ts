import { HexString } from '@vara-eth/api';

import { EXPLORER_URL } from '@/shared/config';
import { fetchWithGuard } from '@/shared/utils';

export const INDEXER_ENTITY = {
  BATCH: 'Batch',
  CODE: 'Code',
  MESSAGE_REQUEST: 'MessageRequest',
  MESSAGE_SENT: 'MessageSent',
  PROGRAM: 'Program',
  STATE_TRANSITION: 'StateTransition',
  TX: 'Tx',
  REPLY_REQUEST: 'ReplyRequest',
  REPLY_SENT: 'ReplySent',
  ANNOUNCES: 'Announces',
} as const;

type IndexerEntityResponse =
  | { type: typeof INDEXER_ENTITY.BATCH; data: unknown }
  | { type: typeof INDEXER_ENTITY.CODE; data: unknown }
  | { type: typeof INDEXER_ENTITY.MESSAGE_REQUEST; data: unknown }
  | { type: typeof INDEXER_ENTITY.MESSAGE_SENT; data: unknown }
  | { type: typeof INDEXER_ENTITY.PROGRAM; data: unknown }
  | { type: typeof INDEXER_ENTITY.STATE_TRANSITION; data: unknown }
  | { type: typeof INDEXER_ENTITY.TX; data: unknown }
  | { type: typeof INDEXER_ENTITY.REPLY_REQUEST; data: unknown }
  | { type: typeof INDEXER_ENTITY.REPLY_SENT; data: unknown }
  | { type: typeof INDEXER_ENTITY.ANNOUNCES; data: null };

export const getIndexerEntity = (hash: HexString) =>
  fetchWithGuard<IndexerEntityResponse>({ url: `${EXPLORER_URL}/lookup/${hash}` });
