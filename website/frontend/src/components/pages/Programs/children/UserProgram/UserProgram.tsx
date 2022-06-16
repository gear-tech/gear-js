import clsx from 'clsx';
import { Link, generatePath } from 'react-router-dom';
import { Button } from '@gear-js/ui';

import styles from './UserProgram.module.scss';

import { routes } from 'routes';
import { useAlert } from 'hooks';
import { copyToClipboard, fileNameHandler, formatDate } from 'helpers';
import { ProgramModel, ProgramStatus } from 'types/program';
import copySGV from 'assets/images/copy.svg';
import messageSVG from 'assets/images/message.svg';
import uploadMetaSVG from 'assets/images/upload-cloud.svg';

type Props = {
  program: ProgramModel;
  isMetaLinkActive?: boolean;
};

const UserProgram = ({ program, isMetaLinkActive = true }: Props) => {
  const alert = useAlert();

  const { id, name, initStatus, timestamp } = program;

  const handleCopy = () => copyToClipboard(id, alert, 'Program ID copied');

  return (
    <div className={styles.programsListItem}>
      <div className={styles.programWrapper}>
        <span
          className={clsx(
            styles.programsListIndicator,
            initStatus === ProgramStatus.Success && styles.success,
            initStatus === ProgramStatus.Failed && styles.failure,
            initStatus === ProgramStatus.InProgress && styles.loading
          )}
        />
        <div className={styles.programWrapperName}>
          <div className={styles.programsListName}>
            <Link className={styles.programLink} to={generatePath(routes.program, { id })}>
              {fileNameHandler(name || id)}
            </Link>
          </div>
        </div>
        <div className={styles.programsCopyId}>
          <Button icon={copySGV} color="transparent" onClick={handleCopy} />
        </div>
      </div>
      <div className={styles.programWrapperData}>
        <div className={styles.programsListInfo}>
          Timestamp:
          {timestamp && <span className={styles.programsListInfoData}>{formatDate(timestamp)}</span>}
        </div>
      </div>

      <div className={styles.programsListBtns}>
        <Link to={`/send/message/${id}`} className={styles.allProgramsItemSendMessage}>
          <img src={messageSVG} alt="Send message to program" />
        </Link>
        <Link
          to={generatePath(routes.meta, { programId: id })}
          tabIndex={Number(isMetaLinkActive)}
          className={clsx(styles.allProgramsItemUpload, !isMetaLinkActive && styles.linkInactive)}
        >
          <img src={uploadMetaSVG} alt="Upload metadata" />
        </Link>
      </div>
    </div>
  );
};

export { UserProgram };
