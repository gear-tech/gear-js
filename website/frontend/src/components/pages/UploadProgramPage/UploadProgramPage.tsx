import React, { VFC } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { SWITCH_PAGE_TYPES } from 'consts';
import { routes } from 'routes';
import { SocketService } from 'services/SocketService';
import { RecentNotifications } from 'components/blocks/RecentNotifications/RecentNotifications';
import { BlockListAllUploaded } from 'components/blocks/BlocksList/BlockListAllUploaded';
import { ProgramSwitch } from '../../blocks/ProgramSwitch/ProgramSwitch';
import { UploadProgram } from '../../blocks/UploadProgram/UploadProgram';
import { BlocksList } from '../../blocks/BlocksList/BlocksList';
import { BlocksListUploaded } from '../../blocks/BlocksList/BlocksListUploaded';
import './UploadProgramPage.scss';

type Props = {
  socketService: SocketService;
};

export const UploadProgramPage: VFC<Props> = ({ socketService }) => {
  const isUploadedProgramsPage = useRouteMatch(routes.uploadedPrograms);
  const isAllProgramsPage = useRouteMatch(routes.allPrograms);

  let currentPage = SWITCH_PAGE_TYPES.UPLOAD_PROGRAM;

  if (isUploadedProgramsPage) {
    currentPage = SWITCH_PAGE_TYPES.UPLOADED_PROGRAMS;
  } else if (isAllProgramsPage) {
    currentPage = SWITCH_PAGE_TYPES.ALL_PROGRAMS;
  }

  return (
    <div className="main-content-wrapper">
      <ProgramSwitch socketService={socketService} pageType={currentPage} />
      {currentPage === SWITCH_PAGE_TYPES.UPLOAD_PROGRAM && (
        <>
          <UploadProgram socketService={socketService} />
          <BlocksList />
        </>
      )}
      {currentPage === SWITCH_PAGE_TYPES.UPLOADED_PROGRAMS && <BlocksListUploaded socketService={socketService} />}
      {currentPage === SWITCH_PAGE_TYPES.ALL_PROGRAMS && <BlockListAllUploaded socketService={socketService} />}
      <RecentNotifications socketService={socketService} />
    </div>
  );
};
