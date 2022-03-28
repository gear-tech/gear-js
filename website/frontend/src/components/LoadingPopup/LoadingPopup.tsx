import React, { VFC } from 'react';
import { ProgressBar } from 'components/ProgressBar/ProgressBar';
import { PROGRESS_BAR_STATUSES } from 'consts';
import UpGear from 'assets/images/gear_up.svg';
import DownGear from 'assets/images/gear_down.svg';
import './LoadingPopup.scss';

export const LoadingPopup: VFC = () => (
  <div className="loading-popup">
    <div className="overlay-top" />
    <div className="overlay-bottom" />
    <div className="loading-popup--imgs">
      <img src={UpGear} alt="gear" />
      <img src={DownGear} alt="gear" />
    </div>
    <div className="loading-popup--progress">
      <ProgressBar status={PROGRESS_BAR_STATUSES.START} />
      <ProgressBar status={PROGRESS_BAR_STATUSES.READY} />
    </div>
    <div className="loading-popup--text-info">
      <span>Processing...Status:</span>
      <span>start</span>
    </div>
  </div>
);
