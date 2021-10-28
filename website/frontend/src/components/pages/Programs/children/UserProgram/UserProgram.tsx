import React, { VFC } from 'react';
import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { ProgramModel, ProgramStatus } from 'types/program';
import { getProgramAction } from 'store/actions/actions';
import { copyToClipboard, fileNameHandler, formatDate } from 'helpers';
import { useAlert } from 'react-alert';
import RefreshIllustration from 'assets/images/refresh.svg';
import MessageIllustration from 'assets/images/message.svg';
import UploadIcon from 'assets/images/upload.svg';
import styles from './UserProgram.module.scss';

type Props = {
  program: ProgramModel;
  handleOpenForm: (programHash: string, programName?: string, isMessage?: boolean) => void;
};

export const UserProgram: VFC<Props> = ({ program, handleOpenForm }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  return (
    <div className={styles.programsListItem} key={program.hash}>
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
          <button
            type="button"
            className={styles.programsListName}
            onClick={() => copyToClipboard(program.hash, alert, 'Program ID copied')}
          >
            {program.name && fileNameHandler(program.name)}
          </button>
        </div>
        <div className={styles.programWrapperData}>
          <div className={styles.programsListInfo}>
            Number of calls:<span className={styles.programsListInfoData}>{program.callCount}</span>
          </div>
          <div className={styles.programsListInfo}>
            Uploaded at:
            <span className={styles.programsListInfoData}>{program.uploadedAt && formatDate(program.uploadedAt)}</span>
          </div>
        </div>
      </div>
      <div className={styles.programsListBtns}>
        <button type="button" aria-label="refresh" onClick={() => handleOpenForm(program.hash, program.name, true)}>
          <img src={MessageIllustration} alt="message" />
        </button>
        <button
          className={styles.allProgramsItemUpload}
          type="button"
          onClick={() => handleOpenForm(program.hash, program.name)}
        >
          <img src={UploadIcon} alt="upload-program" />
        </button>
      </div>
    </div>
  );
};
