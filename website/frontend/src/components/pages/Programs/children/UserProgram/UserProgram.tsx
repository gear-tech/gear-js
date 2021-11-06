import React, { VFC } from 'react';
import clsx from 'clsx';
import { ProgramModel, ProgramStatus } from 'types/program';
import { copyToClipboard, fileNameHandler, formatDate } from 'helpers';
import { useAlert } from 'react-alert';
import MessageIllustration from 'assets/images/message.svg';
import UploadIcon from 'assets/images/upload.svg';
import Copy from 'assets/images/copy.svg';
import styles from './UserProgram.module.scss';

type Props = {
  program: ProgramModel;
  handleOpenForm: (programHash: string, programName?: string, isMessage?: boolean) => void;
};

export const UserProgram: VFC<Props> = ({ program, handleOpenForm }) => {
  const alert = useAlert();

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
          <div className={styles.programsListName}>{program.name && fileNameHandler(program.name)}</div>
        </div>
        <div className={styles.programsCopyId}>
          <button
            type="button"
            className={styles.programsListName}
            onClick={() => copyToClipboard(program.id, alert, 'Program ID copied')}
          >
            <img src={Copy} alt="copy program ID" />
          </button>
        </div>
        <div className={styles.programWrapperData}>
          <div className={styles.programsListInfo}>
            Uploaded at:
            <span className={styles.programsListInfoData}>{program.uploadedAt && formatDate(program.uploadedAt)}</span>
          </div>
        </div>
      </div>
      <div className={styles.programsListBtns}>
        <button type="button" aria-label="refresh" onClick={() => handleOpenForm(program.id, program.name, true)}>
          <img src={MessageIllustration} alt="message" />
        </button>
        <button
          className={styles.allProgramsItemUpload}
          type="button"
          onClick={() => handleOpenForm(program.id, program.name)}
        >
          <img src={UploadIcon} alt="Upload metadata" />
        </button>
      </div>
    </div>
  );
};
