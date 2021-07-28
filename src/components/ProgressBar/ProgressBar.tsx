import React from 'react';

import { PROGRESS_BAR_STATUSES } from 'consts';

import './ProgressBar.scss'

type ProgressBarTypes = {
  status: string;
}

const ProgressBar = ({ status }: ProgressBarTypes) => (
    <div className={(status !== PROGRESS_BAR_STATUSES.COMPLETED) ? "progress-bar" : "progress-bar green"}>
      {
        status === PROGRESS_BAR_STATUSES.START
        &&
        <div className="progress-bar__indicator"/>
      }
    </div>
);

export default ProgressBar;