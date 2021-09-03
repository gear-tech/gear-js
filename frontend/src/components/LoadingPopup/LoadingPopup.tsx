import React from 'react';

import { useSelector } from 'react-redux';
import { RootState } from 'store/reducers';

import ProgressBar from 'components/ProgressBar';

import { PROGRAM_UPLOAD_STATUSES, PROGRESS_BAR_STATUSES } from 'consts';

import UpGear from 'images/gear_up.svg';
import DownGear from 'images/gear_down.svg';

import './LoadingPopup.scss';

const LoadingPopup = () => {

  const { programStatus } = useSelector((state: RootState) => state.programs)

  let firstStepStatus = PROGRESS_BAR_STATUSES.START;
  let secondStepStats = PROGRESS_BAR_STATUSES.READY;

  if (programStatus) {
    firstStepStatus = PROGRESS_BAR_STATUSES.COMPLETED;
    if (programStatus === PROGRAM_UPLOAD_STATUSES.IN_BLOCK) {
      secondStepStats = PROGRESS_BAR_STATUSES.START;
    } else if (programStatus === PROGRAM_UPLOAD_STATUSES.FINALIZED) {
      secondStepStats = PROGRESS_BAR_STATUSES.COMPLETED;
    }

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
      </div>
      <div className="loading-popup--text-info">
        <span>Processing...Status:</span>
        <span>{programStatus || 'start'}</span>
      </div>
    </div>
  );
};

export default LoadingPopup;