import React from 'react';
import ProgramSwitch from '../ProgramSwitch';
import UploadProgram from '../UploadProgram';
import BlocksList from '../BlocksList';
import BlocksListUploaded from '../BlocksList/BlocksListUploaded';

import './UploadProgramBlock.scss';

type UploadProgramBlock = {
  showUploaded: boolean;
};

const UploadProgramBlock = ({ showUploaded }: UploadProgramBlock) => {
  return (
    <div>
      <ProgramSwitch/>
      {
        !showUploaded &&
        <>
          < UploadProgram/>
          < BlocksList/>
        </>
      }
      {showUploaded && <BlocksListUploaded/> }
    </div>
  );
};

export default UploadProgramBlock;