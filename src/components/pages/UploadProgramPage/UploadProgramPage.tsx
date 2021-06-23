import React, { useEffect, useState} from 'react';
import ProgramSwitch from '../../blocks/ProgramSwitch';
import UploadProgram from '../../blocks/UploadProgram';
import BlocksList from '../../blocks/BlocksList';
// import BlocksListUploaded from '../../blocks/BlocksList/BlocksListUploaded';

import './UploadProgramPage.scss';

type UploadProgramPageType = {
  showUploaded: boolean;
};

const UploadProgramPage = ({ showUploaded }: UploadProgramPageType) => {


  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const decreasedTime = timeLeft + 0.1 >= 7 ? 0 : timeLeft + 0.1;
      setTimeLeft(decreasedTime);
    }, 100);
    return () => clearInterval(intervalId);
  }, [setTimeLeft, timeLeft])

  return (
    <div className="main-content-wrapper">
      <ProgramSwitch showUploaded={showUploaded} timeLeft={timeLeft}/>
      {!showUploaded && (
        <>
          <UploadProgram />
          <BlocksList />
        </>
      )}
      {showUploaded && <BlocksListUploaded />}
    </div>
  )
};

export default UploadProgramPage;
