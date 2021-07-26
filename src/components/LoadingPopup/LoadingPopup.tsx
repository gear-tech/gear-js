import React from 'react';

import { useSelector } from 'react-redux';
import { RootState } from 'store/reducers';

import ProgressBar from 'components/ProgressBar';

import { PROGRAM_UPLOAD_STATUSES, PROGRESS_BAR_STATUSES } from 'consts';

import UpGear from 'images/gear_up.svg';
import DownGear from 'images/gear_down.svg';

import './LoadingPopup.scss';

const LoadingPopup = () => {

  const { programUploadingStatus, isProgramUploading } = useSelector((state: RootState) => state.programs)

  let firstStepStatus = PROGRESS_BAR_STATUSES.START;
  let secondStepStats = PROGRESS_BAR_STATUSES.READY;
  let thirdStepStatus = PROGRESS_BAR_STATUSES.READY;

  if (programUploadingStatus) {
    firstStepStatus = PROGRESS_BAR_STATUSES.COMPLETED;

    if (programUploadingStatus === PROGRAM_UPLOAD_STATUSES.IN_BLOCK) {
      secondStepStats = PROGRESS_BAR_STATUSES.START;
    } else if (programUploadingStatus === PROGRAM_UPLOAD_STATUSES.FINALIZED) {
      thirdStepStatus = PROGRESS_BAR_STATUSES.START;
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
        {
          isProgramUploading
          &&
          (
          <>
            <ProgressBar status={secondStepStats}/>
            <ProgressBar status={thirdStepStatus}/>
          </>
          )
        }
      </div>
      <div className="loading-popup--text-info">
        <span>Processing...Status:</span>
        <span>{programUploadingStatus || 'start'}</span>
      </div>
    </div>
  );
};

export default LoadingPopup;