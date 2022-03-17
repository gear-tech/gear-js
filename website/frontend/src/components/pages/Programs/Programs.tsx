import React, { VFC } from 'react';
import { useMatch } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { routes } from 'routes';
import { SWITCH_PAGE_TYPES } from 'consts';
import { Messages } from 'components/pages/Messages/Messages';
import { All } from 'components/pages/Programs/children/All/All';
import { ProgramSwitch } from '../../blocks/ProgramSwitch/ProgramSwitch';
import { Upload } from './children/Upload/Upload';
import { BlockList } from './children/BlocksList/BlocksList';
import { Recent } from './children/Recent/Recent';
import './Programs.scss';
import { Select } from 'common/components/Select/Select';

const options = [
  { value: 'Option 1', label: 'option 1' },
  { value: 'Option 2', label: 'option 2' },
  { value: 'Option 3', label: 'option 3' },
  { value: 'Option 4', label: 'option 4' },
  { value: 'Option 5', label: 'option 5' },
];

export const Programs: VFC = () => {
  const isUploadedProgramsPage = useMatch(routes.uploadedPrograms);
  const isAllProgramsPage = useMatch(routes.allPrograms);
  const isAllMessagesPage = useMatch(routes.messages);
  let currentPage = SWITCH_PAGE_TYPES.UPLOAD_PROGRAM;

  if (isUploadedProgramsPage) {
    currentPage = SWITCH_PAGE_TYPES.UPLOADED_PROGRAMS;
  } else if (isAllProgramsPage) {
    currentPage = SWITCH_PAGE_TYPES.ALL_PROGRAMS;
  } else if (isAllMessagesPage) {
    currentPage = SWITCH_PAGE_TYPES.ALL_MESSAGES;
  }

  return (
    <div className="main-content-wrapper">
      <ProgramSwitch pageType={currentPage} />
      <Select options={options} />
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
      {currentPage === SWITCH_PAGE_TYPES.ALL_MESSAGES && <Messages />}
    </div>
  );
};
