import React, { VFC } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import messageIcon from 'assets/images/message.svg';
import backIcon from 'assets/images/arrow_back_bold.svg';
import './Message.scss';

export const Message: VFC = () => {
  const params: any = useParams();
  const id: string = params?.id;
  const history = useHistory();

  const handleGoBack = () => {
    history.goBack();
  };

  return (
    <div className="message">
      <div className={clsx('message__block', 'message__id')}>
        <span className="message__block-caption">MESSAGE ID:</span>
        <div className="message__status-block">
          <span className={clsx('message__block-status', 'message__block-status_success')} />
          <p className="message__block-paragraph">0x1848858f8fdc9cd3f84d47906effef0a0f211df1325f6352eb52ed777a9c030e</p>
        </div>
      </div>
      <div className="message__block">
        <span className="message__block-caption">Source:</span>
        <p className="message__block-paragraph">
          5f6352eb52ed777a9c030e <span className="message__block-value">(default.wasm)</span>
        </p>
      </div>
      <div className="message__block">
        <span className="message__block-caption">Destination:</span>
        <p className="message__block-paragraph">
          Alice <span className="message__block-value">(312c441241151cx231251er2312r31)</span>
        </p>
      </div>
      <div className="message__block">
        <span className="message__block-caption">Timestamp:</span>
        <p className="message__block-paragraph">2021-08-04T09:24:06.088Z</p>
      </div>
      <pre className="message__meta">.... text</pre>
      <div className="message__buttons">
        <button type="button" className="message__button" onClick={handleGoBack}>
          <img src={backIcon} className="message__button-icon" alt="reply" />
          <span className="nodes-hide-text">Back</span>
        </button>
        <button type="button" className="message__button">
          <img src={messageIcon} className="message__button-icon" alt="reply" />
          <span className="nodes-hide-text">Reply</span>
        </button>
      </div>
    </div>
  );
};
