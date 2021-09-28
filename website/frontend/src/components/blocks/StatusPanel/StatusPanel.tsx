import React, { VFC } from 'react';
import './StatusPanel.scss';

type Props = {
  onClose: () => void;
  statusPanelText: string | null;
  isError?: boolean;
};

export const StatusPanel: VFC<Props> = ({ onClose, statusPanelText, isError }) => (
  <div className={isError ? 'status-panel-block error' : 'status-panel-block'}>
    <p className="status-panel-block__msg">{statusPanelText || 'Upload error: Incorrect file format'}</p>
    <button
      className={isError ? 'status-panel-block__close-btn error' : 'status-panel-block__close-btn'}
      type="button"
      onClick={onClose}
      aria-label="close"
    />
  </div>
);

StatusPanel.defaultProps = {
  isError: false,
};
