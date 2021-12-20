import React, { VFC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import codeIcon from 'assets/images/code_icon.svg';
import idIcon from 'assets/images/id_icon.svg';
import timestampIcon from 'assets/images/timestamp_icon.svg';
import ServerRPCRequestService from 'services/ServerRPCRequestService';
import { RootState } from 'store/reducers';
import { RPC_METHODS } from 'consts';
import './MessageList.scss';

type Props = {
  programId: string;
  programName: string;
};

export const MessageList: VFC<Props> = ({ programId, programName }) => {
  const currentAccount = useSelector((state: RootState) => state.account.account);

  const [messages, setMessages] = useState(null);

  return (
    <div className="messages">
      <p className="messages__caption">NOTIFICATIONS</p>
      <div className="messages__list">
        <div className={clsx('messages__list-block', 'messages__list-block__header')}>
          <div className="messages__list-item">
            <img className="messages__list-icon" src={codeIcon} alt="program name" />
            <p>Program name</p>
          </div>
          <div className="messages__list-item">
            <img className="messages__list-icon" src={idIcon} alt="program id" />
            <p>Message Id</p>
          </div>
          <div className="messages__list-item">
            <img className="messages__list-icon" src={timestampIcon} alt="program date" />
            <p>Timestamp</p>
          </div>
        </div>
        <div className={clsx('messages__list-block', 'messages__list-block_success')}>
          <div className="messages__list-item">
            <span className="messages__list-status" />
            <p>Program name</p>
          </div>
          <div className={clsx('messages__list-item', 'messages__list-item_gray')}>
            <p>0x1848858f8fdc9cd3f84d47906effef0a0f211df1325f6352eb52ed777a9c030e</p>
          </div>
          <div className="messages__list-item">
            <p>2021-08-04T09:24:06.088Z</p>
          </div>
        </div>
        <div className={clsx('messages__list-block', 'messages__list-block_error')}>
          <div className="messages__list-item">
            <span className="messages__list-status" />
            <p>Program name</p>
          </div>
          <div className={clsx('messages__list-item', 'messages__list-item__gray')}>
            <p>0x1848858f8fdc9cd3f84d47906effef0a0f211df1325f6352eb52ed777a9c030e</p>
          </div>
          <div className="messages__list-item">
            <p>2021-08-04T09:24:06.088Z</p>
          </div>
        </div>
        <div className={clsx('messages__list-block', 'messages__list-block_success')}>
          <div className="messages__list-item">
            <span className="messages__list-status" />
            <p>Program name</p>
          </div>
          <div className={clsx('messages__list-item', 'messages__list-item__gray')}>
            <p>0x1848858f8fdc9cd3f84d47906effef0a0f211df1325f6352eb52ed777a9c030e</p>
          </div>
          <div className="messages__list-item">
            <p>2021-08-04T09:24:06.088Z</p>
          </div>
        </div>
        <div className={clsx('messages__list-block', 'messages__list-block_error')}>
          <div className="messages__list-item">
            <span className="messages__list-status" />
            <p>Program name</p>
          </div>
          <div className={clsx('messages__list-item', 'messages__list-item__gray')}>
            <p>0x1848858f8fdc9cd3f84d47906effef0a0f211df1325f6352eb52ed777a9c030e</p>
          </div>
          <div className="messages__list-item">
            <p>2021-08-04T09:24:06.088Z</p>
          </div>
        </div>
        <div className={clsx('messages__list-block', 'messages__list-block_error')}>
          <div className="messages__list-item">
            <span className="messages__list-status" />
            <p>Program name</p>
          </div>
          <div className={clsx('messages__list-item', 'messages__list-item__gray')}>
            <p>0x1848858f8fdc9cd3f84d47906effef0a0f211df1325f6352eb52ed777a9c030e</p>
          </div>
          <div className="messages__list-item">
            <p>2021-08-04T09:24:06.088Z</p>
          </div>
        </div>
      </div>
    </div>
  );
};
