import React from 'react';

import { useSelector } from 'react-redux';
import { RootState } from 'store/reducers';

import ProgressBar from 'components/ProgressBar';

import UpGear from 'images/gear_up.svg';
import DownGear from 'images/gear_down.svg';

import './LoadingPopup.scss';

const LoadingPopup = () => {

  const { programUploadingStatus } = useSelector((state: RootState) => state.programs)

  const firstStepStatus = programUploadingStatus ? "completed" : "start";
  const secondStepStats = programUploadingStatus ? "start" : "before";

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
        <span>{programUploadingStatus ? 'in block' : 'start'}</span>
      </div>
    </div>
  );
};

export default LoadingPopup;