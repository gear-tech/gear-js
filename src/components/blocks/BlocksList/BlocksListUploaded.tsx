import React from 'react';

import './BlocksList.scss';

const BlocksListUploaded = () => {
  return (
    <div className="block-list">
      <ul className="programs-list">
        <li className="programs-list__item">
          <span className="programs-list__number">214</span>
          <span className="programs-list__name">awesomeprogramname.tbd</span>
          <span className="programs-list__info">Number of calls:<span className="programs-list__info-data">0</span></span>
          <span className="programs-list__info">Uploaded at:<span className="programs-list__info-data">05-13-2021 15:24:17</span></span>
          <button className="programs-list__refresh-btn" type="button"/>
        </li>
        <li className="programs-list__item">
          <span className="programs-list__number">213</span>
          <span className="programs-list__name">awesomeprogramname.tbd</span>
          <span className="programs-list__info">Number of calls:<span className="programs-list__info-data">12</span></span>
          <span className="programs-list__info">Uploaded at:<span className="programs-list__info-data">05-13-2021 15:24:17</span></span>
          <button className="programs-list__refresh-btn" type="button"/>
        </li>
        <li className="programs-list__item">
          <span className="programs-list__number">212</span>
          <span className="programs-list__name">awesomeprogramname.tbd</span>
          <span className="programs-list__info">Number of calls:<span className="programs-list__info-data">2</span></span>
          <span className="programs-list__info">Uploaded at:<span className="programs-list__info-data">05-13-2021 15:24:17</span></span>
          <button className="programs-list__refresh-btn" type="button"/>
        </li>
        <li className="programs-list__item">
          <span className="programs-list__number">211</span>
          <span className="programs-list__name">awesomeprogramname.tbd</span>
          <span className="programs-list__info">Number of calls:<span className="programs-list__info-data">4</span></span>
          <span className="programs-list__info">Uploaded at:<span className="programs-list__info-data">05-13-2021 15:24:17</span></span>
          <button className="programs-list__refresh-btn" type="button"/>
        </li>
        <li className="programs-list__item">
          <span className="programs-list__number">210</span>
          <span className="programs-list__name">awesomeprogramname.tbd</span>
          <span className="programs-list__info">Number of calls:<span className="programs-list__info-data">982</span></span>
          <span className="programs-list__info">Uploaded at:<span className="programs-list__info-data">05-13-2021 15:24:17</span></span>
          <button className="programs-list__refresh-btn" type="button"/>
        </li>
        <li className="programs-list__item">
          <span className="programs-list__number">209</span>
          <span className="programs-list__name">awesomeprogramname.tbd</span>
          <span className="programs-list__info">Number of calls:<span className="programs-list__info-data">12</span></span>
          <span className="programs-list__info">Uploaded at:<span className="programs-list__info-data">05-13-2021 15:24:17</span></span>
          <button className="programs-list__refresh-btn" type="button"/>
        </li>
      </ul>
    </div>
  );
};

export default BlocksListUploaded;