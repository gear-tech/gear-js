import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import './ProgramSwitch.scss';
import { routes } from 'routes';
import { useDispatch, useSelector } from 'react-redux';
import { SocketService } from 'services/SocketService';
import { RootState } from 'store/reducers';

type ProgramSwitchType = {
  showUploaded: boolean;
  socketService: SocketService;
};

const ProgramSwitch = ({ showUploaded, socketService }: ProgramSwitchType) => {

  const dispatch = useDispatch();

  const [timeInstance, setTimeInstance] = useState(0)
  const [isTotalIssuance, setIsTotalIssuance] = useState(false);

  const { totalIssuance } = useSelector((state: RootState) => state.blocks)
  
  useEffect(() => {
    if (!isTotalIssuance && socketService) {
      socketService.getTotalIssuance();
      socketService.subscribeNewBlocks();
      setIsTotalIssuance(true);
    }
    const intervalId = setInterval(() => {
      const decreasedTime = timeInstance + 0.1 >= 7 ? 0 : timeInstance + 0.1;
      setTimeInstance(decreasedTime);
    }, 100);
    return () => clearInterval(intervalId);
  }, [dispatch, setTimeInstance, timeInstance, setIsTotalIssuance, isTotalIssuance, socketService])

  return (
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
            <div className="switch-info__num">{timeInstance.toFixed(1).slice(0, 1)}</div>
            .
            <div className="switch-info__num">{timeInstance.toFixed(1).slice(-1)}</div> s
          </div>
        </div>
        <div className="switch-info__separator" />
        <div className="switch-info__col">
          <span className="switch-info__title">Total issuance</span>
          <span className="switch-info__data">
            <b className="switch-info__num">{totalIssuance?.totalIssuance.split(" ")[0]}</b> {totalIssuance?.totalIssuance.split(" ")[1]}
          </span>
        </div>
      </div>
    </div>
  )
};

export default ProgramSwitch;
