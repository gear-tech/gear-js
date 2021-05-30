import React from 'react';

import './ProgramSwitch.scss';

const ProgramSwitch = () => {
  return (
    <div className="switch-block">
      <div className="switch-buttons">
        <button className="switch-buttons__item switch-buttons__item--active" type="button">Upload program</button>
        <button className="switch-buttons__item" type="button">Recent uploaded programs</button>
      </div>
      <div className="switch-block__info switch-info">
        <div className="switch-info__col">
          <span className="switch-info__title">Last block</span>
          <span className="switch-info__data"><b className="switch-info__num">2,9</b> s</span>
        </div>
        <div className="switch-info__separator"/>
        <div className="switch-info__col">
          <span className="switch-info__title">Total issuance</span>
          <span className="switch-info__data"><b className="switch-info__num">100,241</b> MUnits</span>
        </div>
      </div>
    </div>
  );
};

export default ProgramSwitch;