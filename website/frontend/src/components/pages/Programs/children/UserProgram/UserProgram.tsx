import clsx from 'clsx';
import { ProgramModel, ProgramStatus } from 'types/program';
import { copyToClipboard, fileNameHandler, formatDate } from 'helpers';
import { useAlert } from 'hooks';
import { Link, generatePath } from 'react-router-dom';
import { routes } from 'routes';
import MessageIllustration from 'assets/images/message.svg';
import UploadIcon from 'assets/images/upload-cloud.svg';
import Copy from 'assets/images/copy.svg';
import styles from './UserProgram.module.scss';

type Props = {
  program: ProgramModel;
  isMetaLinkActive?: boolean;
};

export const UserProgram = (props: Props) => {
  const alert = useAlert();

  const { program, isMetaLinkActive = true } = props;

  return (
    <div className={styles.programsListItem} key={program.id}>
      <div className={styles.programWrapper}>
        <span
          className={clsx(
            styles.programsListIndicator,
            program.initStatus === ProgramStatus.Success && styles['program-item-success'],
            program.initStatus === ProgramStatus.Failed && styles['program-item-failure'],
            program.initStatus === ProgramStatus.InProgress && styles['program-item-loading']
          )}
        />
        <div className={styles.programWrapperName}>
          <div className={styles.programsListName}>
            <Link className={styles.programLink} to={`/program/${program.id}`}>
              {program.name && fileNameHandler(program.name)}
            </Link>
          </div>
        </div>
        <div className={styles.programsCopyId}>
          <button type="button" onClick={() => copyToClipboard(program.id, alert, 'Program ID copied')}>
            <img src={Copy} alt="copy program ID" />
          </button>
        </div>
      </div>
      <div className={styles.programWrapperData}>
        <div className={styles.programsListInfo}>
          Timestamp:
          <span className={styles.programsListInfoData}>{program.timestamp && formatDate(program.timestamp)}</span>
        </div>
      </div>

      <div className={styles.programsListBtns}>
        <Link to={`/send/message/${program.id}`} className={styles.allProgramsItemSendMessage}>
          <img src={MessageIllustration} alt="Send message to program" />
        </Link>
        <Link
          to={generatePath(routes.meta, { programId: program.id })}
          tabIndex={Number(isMetaLinkActive)}
          className={clsx(styles.allProgramsItemUpload, !isMetaLinkActive && styles.linkInactive)}
        >
          <img src={UploadIcon} alt="Upload metadata" />
        </Link>
      </div>
    </div>
  );
};
