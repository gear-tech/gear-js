import React from 'react';

import { useSelector } from 'react-redux';
import { RootState } from 'store/reducers';

import ProgressBar from 'components/ProgressBar';

import UpGear from 'images/gear_up.svg';
import DownGear from 'images/gear_down.svg';

import './LoadingPopup.scss';

const LoadingPopup = () => {

  const { programUploadingStatus } = useSelector((state: RootState) => state.programs)

  let firstStepStatus = "start";
  let secondStepStats = "before";
  let thirdStepStatus = "before";
  let fourthStepStats = "before";
  if (programUploadingStatus) {
    firstStepStatus = "completed";
  }

  if (programUploadingStatus) {
    if (programUploadingStatus === "in block") {
      secondStepStats = "start";
    } else {
      secondStepStats = "completed"
    }

  }

  if (firstStepStatus === "completed" && secondStepStats === "completed") {
    if (programUploadingStatus === "finalized") {
      thirdStepStatus = "completed"
    } else {
      thirdStepStatus = "start"
    }
  }

  if (firstStepStatus === "completed" && secondStepStats === "completed" && thirdStepStatus === "completed") {
    fourthStepStats = "start"
  }

  return (
    <div className="loading-popup">
      <div className="overlay-top"/>
      <div className="overlay-bottom"/>
      <div className="loading-popup--imgs">
        <img src={UpGear} alt="gear" />
        <img src={DownGear} alt="gear" />
      </div>
      <div className="loading-popup--progress">
        <ProgressBar status={firstStepStatus}/>
        <ProgressBar status={secondStepStats}/>
        <ProgressBar status={thirdStepStatus}/>
        <ProgressBar status={fourthStepStats}/>
      </div>
      <div className="loading-popup--text-info">
        <span>Processing...Status:</span>
        <span>{programUploadingStatus || 'start'}</span>
      </div>
    </div>
  );
};

export default LoadingPopup;