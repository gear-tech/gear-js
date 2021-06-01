import React from 'react';
import classNames from 'classnames';
import {Link} from 'react-router-dom';

import './ProgramSwitch.scss';

type ProgramSwitchType = {
  showUploaded: boolean;
}

const ProgramSwitch = ({showUploaded}: ProgramSwitchType) => {
  console.log(showUploaded);
  return (
    <div className="switch-block">
      <div className="switch-buttons">
        <Link to="/upload-program" className={classNames("switch-buttons__item", {"switch-buttons__item--active": !showUploaded})} >Upload program</Link>
        <Link to="/uploaded-programs" className={classNames("switch-buttons__item", {"switch-buttons__item--active": showUploaded})} >Recent uploaded programs</Link>
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