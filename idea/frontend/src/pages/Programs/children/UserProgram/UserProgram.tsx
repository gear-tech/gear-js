import { memo } from 'react';
import clsx from 'clsx';
import { Link, generatePath } from 'react-router-dom';
import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import styles from './UserProgram.module.scss';
import { getIndicatorStatus } from './helpers';

import { routes } from 'routes';
import { copyToClipboard, formatDate } from 'helpers';
import { ProgramModel } from 'types/program';
import { CustomLink } from 'components/common/CustomLink';
import { CircleIndicator } from 'components/common/CircleIndicator';
import copySVG from 'assets/images/copy.svg';
import messageSVG from 'assets/images/message.svg';
import uploadMetaSVG from 'assets/images/upload-cloud.svg';

type Props = {
  program: ProgramModel;
  isMetaLinkActive?: boolean;
};

const UserProgram = memo<Props>(({ program, isMetaLinkActive = true }) => {
  const alert = useAlert();

  const { id: programId, name, initStatus, timestamp } = program;

  const handleCopy = () => copyToClipboard(programId, alert, 'Program ID copied');

  return (
    <div className={styles.programsListItem}>
      <div className={styles.programWrapper}>
        <CircleIndicator status={getIndicatorStatus(initStatus)} className={styles.programsListIndicator} />
        <div className={styles.programWrapperName}>
          <CustomLink to={generatePath(routes.program, { programId })} text={name || programId} />
        </div>
        <div className={styles.programsCopyId}>
          <Button icon={copySVG} color="transparent" onClick={handleCopy} />
        </div>
      </div>
      <div className={styles.programWrapperData}>
        Timestamp:
        {timestamp && <span className={styles.programsListInfoData}>{formatDate(timestamp)}</span>}
      </div>

      <div className={styles.programsListBtns}>
        <Link to={`/send/message/${programId}`} className={styles.allProgramsItemSendMessage}>
          <img src={messageSVG} alt="Send message to program" />
        </Link>
        <Link
          to={generatePath(routes.meta, { programId })}
          tabIndex={Number(isMetaLinkActive)}
          className={clsx(styles.allProgramsItemUpload, !isMetaLinkActive && styles.linkInactive)}
        >
          <img src={uploadMetaSVG} alt="Upload metadata" />
        </Link>
      </div>
    </div>
  );
});

export { UserProgram };
