import React, { VFC } from 'react';
import { ProgressBar } from '../../ProgressBar/ProgressBar';
import UpGear from '../../../assets/images/gear_up.svg';
import DownGear from '../../../assets/images/gear_down.svg';

import './SimpleLoader.scss';

export const SimpleLoader: VFC = () => (
  <div className="loading">
    <div className="loading__overlay-top" />
    <div className="loading__overlay-bottom" />
    <div className="loading__imgs">
      <img src={UpGear} alt="gear" />
      <img src={DownGear} alt="gear" />
    </div>
    <div className="loading__botton-block">
      <ProgressBar status="START" />
      <div className="loading__text">
        <span>Loading ...</span>
      </div>
    </div>
  </div>
);
