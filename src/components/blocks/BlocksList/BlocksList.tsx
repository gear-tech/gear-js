import React from 'react';

import './BlocksList.scss';

const BlocksList = () => {

  const showMoreClick = () => {
    console.log('click');
    const list = document.querySelector('.programs-list--short-list');
    console.log(list?.classList);
    list?.classList.remove('programs-list--short-list');
    const showMoreBtn = document.querySelector('.block-list__button');
    if ( showMoreBtn !== null ) {
      showMoreBtn.classList.add('block-list__button--hidden');
    }
  };

  return (
    <div className="block-list">
      <h3 className="block-list__header">Recent blocks: 214</h3>
      <ul className="programs-list programs-list--short-list">
        <li className="programs-list__item">
          <span className="programs-list__number">214</span>
          <span className="programs-list__name">CA737F1014A48F4C0B6DD43CB177B0AFD9E5169367544C494011E3317DBF9A509CB1E5DC1E85A941BBEE3D7F2AFBC9B1</span>
        </li>
        <li className="programs-list__item">
          <span className="programs-list__number">213</span>
          <span className="programs-list__name">CA737F1014A48F4C0B6DD43CB177B0AFD9E5169367544C494011E3317DBF9A509CB1E5DC1E85A941BBEE3D7F2AFBC9B1</span>
        </li>
        <li className="programs-list__item">
          <span className="programs-list__number">212</span>
          <span className="programs-list__name">CA737F1014A48F4C0B6DD43CB177B0AFD9E5169367544C494011E3317DBF9A509CB1E5DC1E85A941BBEE3D7F2AFBC9B1</span>
        </li>
        <li className="programs-list__item">
          <span className="programs-list__number">211</span>
          <span className="programs-list__name">CA737F1014A48F4C0B6DD43CB177B0AFD9E5169367544C494011E3317DBF9A509CB1E5DC1E85A941BBEE3D7F2AFBC9B1</span>
        </li>
        <li className="programs-list__item">
          <span className="programs-list__number">210</span>
          <span className="programs-list__name">CA737F1014A48F4C0B6DD43CB177B0AFD9E5169367544C494011E3317DBF9A509CB1E5DC1E85A941BBEE3D7F2AFBC9B1</span>
        </li>
        <li className="programs-list__item">
          <span className="programs-list__number">209</span>
          <span className="programs-list__name">CA737F1014A48F4C0B6DD43CB177B0AFD9E5169367544C494011E3317DBF9A509CB1E5DC1E85A941BBEE3D7F2AFBC9B1</span>
        </li>
        <li className="programs-list__item">
          <span className="programs-list__number">208</span>
          <span className="programs-list__name">CA737F1014A48F4C0B6DD43CB177B0AFD9E5169367544C494011E3317DBF9A509CB1E5DC1E85A941BBEE3D7F2AFBC9B1</span>
        </li>
      </ul>
      <button className="block-list__button" type="button" onClick={showMoreClick}>Show more</button>
    </div>
  );
};

export default BlocksList;