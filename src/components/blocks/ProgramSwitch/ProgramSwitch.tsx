import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import './ProgramSwitch.scss';
import { routes } from 'routes';

type ProgramSwitchType = {
  showUploaded: boolean;
  timeLeft: number;
};

const ProgramSwitch = ({ showUploaded, timeLeft }: ProgramSwitchType) => (
  <div className="switch-block">
    <div className="switch-buttons">
      <Link
        to={routes.main}
        className={classNames('switch-buttons__item', { 'switch-buttons__item--active': !showUploaded })}
      >
        Upload program
      </Link>
      <Link
        to={routes.uploadedPrograms}
        className={classNames('switch-buttons__item', { 'switch-buttons__item--active': showUploaded })}
      >
        Recent uploaded programs
      </Link>
    </div>
    <div className="switch-block__info switch-info">
      <div className="switch-info__col">
        <span className="switch-info__title">Last block</span>
        <div className="switch-info__data switch-info__timer">
          <div className="switch-info__num">{timeLeft.toFixed(1).slice(0, 1)}</div>
          .
          <div className="switch-info__num">{timeLeft.toFixed(1).slice(-1)}</div> s
        </div>
      </div>
      <div className="switch-info__separator" />
      <div className="switch-info__col">
        <span className="switch-info__title">Total issuance</span>
        <span className="switch-info__data">
          <b className="switch-info__num">100,241</b> MUnits
        </span>
      </div>
    </div>
  </div>
);

export default ProgramSwitch;
