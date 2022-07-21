import { Hex } from '@gear-js/api';
import { useState } from 'react';
import { getProgramId } from 'utils';
import { useUploadProgram } from './useUploadProgram';

const useProgram = () => {
  const [programId, setProgramId] = useState(getProgramId());
  const uploadProgram = useUploadProgram(setProgramId);

  const resetProgramId = () => setProgramId('' as Hex);

  return { programId, setProgramId, resetProgramId, uploadProgram };
};

export { useProgram };
