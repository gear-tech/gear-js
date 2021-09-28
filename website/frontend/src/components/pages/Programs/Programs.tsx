import React, { VFC } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { SWITCH_PAGE_TYPES } from 'consts';
import { routes } from 'routes';
import { SocketService } from 'services/SocketService';
import { RecentNotifications } from 'components/blocks/RecentNotifications/RecentNotifications';
import { All } from 'components/pages/Programs/children/All/All';
import { ProgramSwitch } from '../../blocks/ProgramSwitch/ProgramSwitch';
import { Upload } from './children/Upload/Upload';
import { BlocksList } from './children/BlocksList/BlocksList';
import { Recent } from './children/Recent/Recent';
import './Programs.scss';

type Props = {
  socketService: SocketService;
};

export const Programs: VFC<Props> = ({ socketService }) => {
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
          <Upload socketService={socketService} />
          <BlocksList />
        </>
      )}
      {currentPage === SWITCH_PAGE_TYPES.UPLOADED_PROGRAMS && <Recent socketService={socketService} />}
      {currentPage === SWITCH_PAGE_TYPES.ALL_PROGRAMS && <All socketService={socketService} />}
      <RecentNotifications socketService={socketService} />
    </div>
  );
};
