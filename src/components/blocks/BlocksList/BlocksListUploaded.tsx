import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProgramAction, getProgramsAction } from 'store/actions/actions';
import { RootState } from 'store/reducers';

import './BlocksList.scss';

export const BlocksListUploaded = () => {

  const dispatch = useDispatch();

  const { programs } = useSelector((state: RootState) => state.programs)

  const formatProgramDate = (rawDate: string) => {
    const date = new Date(rawDate);
    const programTime = date.toLocaleTimeString('en-GB');
    const programDate = date.toLocaleDateString('en-US').replaceAll('/', '-')
    return `${programDate} ${programTime}`;
  }

  const handleRefreshProgram = (programHash: string) => {
    dispatch(getProgramAction(programHash))
  }

  useEffect(() => {
    dispatch(getProgramsAction());
  }, [dispatch])

  return (
    <div className="block-list">
    <ul className="programs-list">
      {
        programs && programs.length && programs.map((program) => (
          <li className="programs-list__item">
            <span className="programs-list__number">{program.programNumber}</span>
            <span className="programs-list__name">{program.name}</span>
            <span className="programs-list__info">
              Number of calls:<span className="programs-list__info-data">{program.callCount}</span>
            </span>
            <span className="programs-list__info">
              Uploaded at:<span className="programs-list__info-data">{formatProgramDate(program.uploadedAt)}</span>
            </span>
            <button
              className="programs-list__refresh-btn"
              type="button"
              aria-label="refresh"
              onClick={() => handleRefreshProgram(program.hash)}
            />
          </li>
        ))
      }
    </ul>
  </div>
  )
};
