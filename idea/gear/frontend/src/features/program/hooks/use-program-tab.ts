import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { PROGRAM_TAB_ID, PROGRAM_TAB_SEARCH_PARAM, PROGRAM_TABS } from '../consts';
import { ProgramTabId } from '../types';

const DEFAULT_TAB_ID = PROGRAM_TABS[0].id;

const getSearchParamsTabId = (searchParams: URLSearchParams) => {
  const tabId = searchParams.get(PROGRAM_TAB_SEARCH_PARAM)?.toLowerCase();

  if (!tabId || !PROGRAM_TABS.some(({ id }) => id === tabId)) return DEFAULT_TAB_ID;

  return tabId as ProgramTabId;
};

function useProgramTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsId = useMemo(() => getSearchParamsTabId(searchParams), [searchParams]);

  const [id, setId] = useState(searchParamsId);

  const isMessages = id === PROGRAM_TAB_ID.MESSAGES;
  const isEvents = id === PROGRAM_TAB_ID.EVENTS;
  const isVouchers = id === PROGRAM_TAB_ID.VOUCHERS;
  const isMetadata = id === PROGRAM_TAB_ID.METADATA;

  useEffect(() => {
    setId(searchParamsId);
  }, [searchParamsId]);

  const handleChange = (_id: ProgramTabId) => {
    setId(_id);

    setSearchParams((prevParams) => {
      if (_id === DEFAULT_TAB_ID) {
        prevParams.delete(PROGRAM_TAB_SEARCH_PARAM);
      } else {
        prevParams.set(PROGRAM_TAB_SEARCH_PARAM, _id);
      }

      return prevParams;
    });
  };

  return { id, isMessages, isEvents, isVouchers, isMetadata, handleChange };
}

export { useProgramTab };
