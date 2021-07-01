import React from 'react';

import './ProgressBar.scss'

type ProgressBarTypes = {
  status: string;
}

const ProgressBar = ({ status }: ProgressBarTypes) => (
    <div className={(status !== "completed") ? "progress-bar" : "progress-bar green"}>
      {
        status === "start"
        &&
        <div className="progress-bar__indicator"/>
      }
    </div>
);

export default ProgressBar;