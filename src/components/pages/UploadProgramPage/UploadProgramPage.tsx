import React from 'react';
import ProgramSwitch from '../../blocks/ProgramSwitch';
import UploadProgram from '../../blocks/UploadProgram';
import BlocksList from '../../blocks/BlocksList';
import BlocksListUploaded from '../../blocks/BlocksList/BlocksListUploaded';

import './UploadProgramPage.scss';

type UploadProgramPageType = {
  showUploaded: boolean;
};

const UploadProgramPage = ({ showUploaded }: UploadProgramPageType) => (
  <div className="main-content-wrapper">
    <ProgramSwitch showUploaded={showUploaded} />
    {!showUploaded && (
      <>
        <UploadProgram />
        <BlocksList />
      </>
    )}
    {showUploaded && <BlocksListUploaded />}
  </div>
);

export default UploadProgramPage;
