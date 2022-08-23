import { memo } from 'react';
import clsx from 'clsx';
import { Link, generatePath } from 'react-router-dom';
import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import styles from './ProgramItem.module.scss';
import { getIndicatorStatus } from './helpers';

import { routes } from 'routes';
import { copyToClipboard, formatDate } from 'helpers';
import { ProgramModel } from 'types/program';
import { CustomLink } from 'components/common/CustomLink';
import { CircleIndicator } from 'components/common/CircleIndicator';
import { Tooltip } from 'components/common/Tooltip';
import copySVG from 'assets/images/copy.svg';
import messageSVG from 'assets/images/message.svg';
import uploadMetaSVG from 'assets/images/upload-cloud.svg';

type Props = {
  program: ProgramModel;
  isMetaLinkActive?: boolean;
};

const ProgramItem = memo(({ program, isMetaLinkActive }: Props) => {
  const alert = useAlert();

  const { id: programId, name, initStatus, timestamp } = program;

  const handleCopy = () => copyToClipboard(programId, alert, 'Program ID copied');

  return (
    <>
      <div className={styles.programWrapper}>
        <CircleIndicator status={getIndicatorStatus(initStatus)} className={styles.programsListIndicator} />
        <div className={styles.programWrapperName}>
          <CustomLink to={generatePath(routes.program, { programId })} text={name || programId} />
        </div>
        <Tooltip content="Copy ID">
          <Button icon={copySVG} color="transparent" onClick={handleCopy} />
        </Tooltip>
      </div>

      <span className={styles.programsListInfoData}>{formatDate(timestamp)}</span>

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
    </>
  );
});

export { ProgramItem };
