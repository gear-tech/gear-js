import React, { VFC, useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { routes } from 'routes';
import { UnsubscribePromise } from '@polkadot/api/types';
import { SWITCH_PAGE_TYPES } from 'consts';
import { useDispatch } from 'react-redux';
import { Messages } from 'components/pages/Messages/Messages';
import { fetchBlockAction } from '../../../store/actions/actions';
import { useApi } from '../../../hooks/useApi';
import { TabSwitch } from '../../blocks/TabSwitch/TabSwitch';
import { BlockList } from './children/BlocksList/BlocksList';
import { All } from './children/All/All';
import { Upload } from './children/Upload/Upload';
import { Recent } from './children/Recent/Recent';

import './Tabs.scss';
import { RecentNotifications } from '../../blocks/RecentNotifications/RecentNotifications';

export const Tabs: VFC = () => {
  const isUploadedProgramsPage = useRouteMatch(routes.uploadedPrograms);
  const isAllProgramsPage = useRouteMatch(routes.allPrograms);
  const isMessagesPage = useRouteMatch(routes.messages);
  let currentPage = SWITCH_PAGE_TYPES.UPLOAD_PROGRAM;
  console.log(currentPage);
  if (isUploadedProgramsPage) {
    currentPage = SWITCH_PAGE_TYPES.UPLOADED_PROGRAMS;
  } else if (isAllProgramsPage) {
    currentPage = SWITCH_PAGE_TYPES.ALL_PROGRAMS;
  } else if (isMessagesPage) {
    currentPage = SWITCH_PAGE_TYPES.MESSAGES;
  }
  console.log(currentPage);
  const [api] = useApi();
  const dispatch = useDispatch();

  useEffect(() => {
    let unsub: UnsubscribePromise | null = null;

    if (api) {
      unsub = api.gearEvents.subscribeNewBlocks((event) => {
        dispatch(
          fetchBlockAction({
            hash: event.hash.toHex(),
            number: event.number.toNumber(),
          })
        );
      });
    }
    return () => {
      if (unsub) {
        (async () => {
          (await unsub)();
        })();
      }
    };
  }, [api, dispatch]);

  return (
    <div className="main-content-wrapper">
      <TabSwitch pageType={currentPage} />
      {currentPage === SWITCH_PAGE_TYPES.UPLOAD_PROGRAM && (
        <>
          <DndProvider backend={HTML5Backend}>
            <Upload />
          </DndProvider>
          <BlockList />
        </>
      )}
      {currentPage === SWITCH_PAGE_TYPES.UPLOADED_PROGRAMS && <Recent />}
      {currentPage === SWITCH_PAGE_TYPES.ALL_PROGRAMS && <All />}
      {currentPage === SWITCH_PAGE_TYPES.MESSAGES && <Messages />}
      <RecentNotifications />
    </div>
  );
};
