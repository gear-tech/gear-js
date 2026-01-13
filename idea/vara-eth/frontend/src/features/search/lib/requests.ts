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

type IndexerEntityResponse = { type: (typeof INDEXER_ENTITY)[keyof typeof INDEXER_ENTITY]; data: unknown };

export const getIndexerEntity = (hash: HexString) =>
  fetchWithGuard<IndexerEntityResponse>({ url: `${EXPLORER_URL}/lookup/${hash}` });
