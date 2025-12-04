import { parseAsStringEnum } from 'nuqs';

import { useSearchParamsState } from '@/hooks';

import { PROGRAM_TAB_ID, PROGRAM_TAB_IDS, PROGRAM_TAB_SEARCH_PARAM, PROGRAM_TABS } from '../consts';

function useProgramTab() {
  const [id, setId] = useSearchParamsState(
    PROGRAM_TAB_SEARCH_PARAM,
    parseAsStringEnum(PROGRAM_TAB_IDS).withDefault(PROGRAM_TABS[0].id),
  );

  const isMessages = id === PROGRAM_TAB_ID.MESSAGES;
  const isEvents = id === PROGRAM_TAB_ID.EVENTS;
  const isVouchers = id === PROGRAM_TAB_ID.VOUCHERS;
  const isMetadata = id === PROGRAM_TAB_ID.METADATA;

  return { id, isMessages, isEvents, isVouchers, isMetadata, setId };
}

export { useProgramTab };
