import React from 'react';

import './StatusPanel.scss';

type StatusPanelType = {
  onClose: () => void;
  statusPanelText: string | null;
  isError?: boolean;
};

const StatusPanel = ({ onClose, statusPanelText, isError }: StatusPanelType) => (
  <div className={isError ? "status-panel-block error" : "status-panel-block"}>
    <p className="status-panel-block__msg">{statusPanelText || 'Upload error: Incorrect file format'}</p>
    <button className={isError ? "status-panel-block__close-btn error" : "status-panel-block__close-btn"} type="button" onClick={onClose} aria-label="close" />
  </div>
);

StatusPanel.defaultProps = {
  isError: false
}

export default StatusPanel;
