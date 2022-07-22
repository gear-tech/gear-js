import { VFC } from 'react';
import { PROGRESS_BAR_STATUSES } from 'consts';
import './ProgressBar.scss';

type Props = {
  status: string;
};

export const ProgressBar: VFC<Props> = ({ status }) => (
  <div className={status !== PROGRESS_BAR_STATUSES.COMPLETED ? 'progress-bar' : 'progress-bar green'}>
    {status === PROGRESS_BAR_STATUSES.START && <div className="progress-bar__indicator" />}
  </div>
);
