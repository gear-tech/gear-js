import React from 'react';
import ProgramSwitch from '../ProgramSwitch';
import UploadProgram from '../UploadProgram';
import BlocksList from '../BlocksList';
import BlocksListUploaded from '../BlocksList/BlocksListUploaded';

import './UploadProgramBlock.scss';

type UploadProgramBlockType = {
  showUploaded: boolean;
};

const UploadProgramBlock = ({ showUploaded }: UploadProgramBlockType) => {
  return (
    <div>
      <ProgramSwitch showUploaded={showUploaded}/>
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