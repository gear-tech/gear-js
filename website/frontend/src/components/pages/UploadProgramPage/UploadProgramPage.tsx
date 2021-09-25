import React, { useContext } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { SWITCH_PAGE_TYPES } from 'consts';
import { routes } from 'routes';
import { RecentNotifications } from 'components/blocks/RecentNotifications';
import { BlockListAllUploaded } from 'components/blocks/BlocksList/BlockListAllUploaded';

import ProgramSwitch from '../../blocks/ProgramSwitch';
import UploadProgram from '../../blocks/UploadProgram';
import { BlocksList } from '../../blocks/BlocksList';
import { BlocksListUploaded } from '../../blocks/BlocksList/BlocksListUploaded';

import './UploadProgramPage.scss';
import { AppContext } from '../../../contexts/AppContext';

const UploadProgramPage = () => {
  const { socketService } = useContext(AppContext);

  const isUploadedProgramsPage = useRouteMatch(routes.uploadedPrograms);
  const isAllProgramsPage = useRouteMatch(routes.allPrograms);

  let currentPage = SWITCH_PAGE_TYPES.UPLOAD_PROGRAM;

  if (isUploadedProgramsPage) {
    currentPage = SWITCH_PAGE_TYPES.UPLOADED_PROGRAMS;
  } else if (isAllProgramsPage) {
    currentPage = SWITCH_PAGE_TYPES.ALL_PROGRAMS;
  }

  return (
    socketService && (
      <div className="main-content-wrapper">
        <ProgramSwitch socketService={socketService} pageType={currentPage} />
        {currentPage === SWITCH_PAGE_TYPES.UPLOAD_PROGRAM && (
          <>
            <DndProvider backend={HTML5Backend}>
              <UploadProgram socketService={socketService} />
            </DndProvider>
            <BlocksList />
          </>
        )}
        {currentPage === SWITCH_PAGE_TYPES.UPLOADED_PROGRAMS && <BlocksListUploaded socketService={socketService} />}
        {currentPage === SWITCH_PAGE_TYPES.ALL_PROGRAMS && <BlockListAllUploaded socketService={socketService} />}
        <RecentNotifications socketService={socketService} />
      </div>
    )
  );
};

export default UploadProgramPage;
