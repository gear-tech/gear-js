import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { PROGRAM_TAB_SEARCH_PARAM, PROGRAM_TABS } from '../consts';
import { ProgramTabId } from '../types';

const DEFAULT_TAB_ID = PROGRAM_TABS[0].id;

const getSearchParamsTabId = (searchParams: URLSearchParams) => {
  const tabId = searchParams.get(PROGRAM_TAB_SEARCH_PARAM)?.toLowerCase();

  if (!tabId || !PROGRAM_TABS.some(({ id }) => id === tabId)) return;

  return tabId as ProgramTabId;
};

function useProgramTabId() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabId, setTabId] = useState(getSearchParamsTabId(searchParams) || DEFAULT_TAB_ID);

  const handleChange = (id: ProgramTabId) => {
    setTabId(id);

    setSearchParams((prevParams) => {
      if (id === DEFAULT_TAB_ID) {
        prevParams.delete(PROGRAM_TAB_SEARCH_PARAM);
      } else {
        prevParams.set(PROGRAM_TAB_SEARCH_PARAM, id);
      }

      return prevParams;
    });
  };

  return [tabId, handleChange] as const;
}

export { useProgramTabId };
