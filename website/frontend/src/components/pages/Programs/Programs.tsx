import React, { useContext, VFC } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { SWITCH_PAGE_TYPES } from 'consts';
import { routes } from 'routes';
import { All } from 'components/pages/Programs/children/All/All';
import { ProgramSwitch } from '../../blocks/ProgramSwitch/ProgramSwitch';
import { Upload } from './children/Upload/Upload';
import { BlocksList } from './children/BlocksList/BlocksList';
import { Recent } from './children/Recent/Recent';
import './Programs.scss';
import { AppContext } from '../../../contexts/AppContext/AppContext';
import { RecentNotifications } from '../../blocks/RecentNotifications/RecentNotifications';

export const Programs: VFC = () => {
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
              <Upload />
            </DndProvider>
            <BlocksList />
          </>
        )}
        {currentPage === SWITCH_PAGE_TYPES.UPLOADED_PROGRAMS && <Recent socketService={socketService} />}
        {currentPage === SWITCH_PAGE_TYPES.ALL_PROGRAMS && <All socketService={socketService} />}
        <RecentNotifications socketService={socketService} />
      </div>
    )
  );
};
