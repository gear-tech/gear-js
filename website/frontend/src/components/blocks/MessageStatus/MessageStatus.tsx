import React, { VFC } from 'react';
import './MessageStatus.scss';

type Props = {
  data: string;
};

export const MessageStatus: VFC<Props> = ({ data }) => (
  <div className="message-status">
    <div className="message-status--info">
      <div className="message-status--info__title">Response:</div>
      <span className="message-status--info__text">{data}</span>
    </div>
  </div>
);
