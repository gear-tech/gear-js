import React from 'react';
import ProgramSwitch from '../ProgramSwitch';
import UploadProgram from '../UploadProgram';
import BlocksList from '../BlocksList';

import './UploadProgramBlock.scss';

const UploadProgramBlock = () => {
  return (
    <div>
      <ProgramSwitch/>
      <UploadProgram/>
      <BlocksList/>
    </div>
  );
};

export default UploadProgramBlock;