import React, { VFC } from 'react';
import { useDispatch } from 'react-redux';
import { ProgramModel } from 'types/program';
import { getProgramAction } from 'store/actions/actions';
import { fileNameHandler, formatDate } from 'helpers';

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

  const handleRefreshProgram = (programHash: string) => {
    dispatch(getProgramAction(programHash));
  };

  return (
    <div className={styles.programsListItem} key={program.hash}>
      <span className={styles.programsListNumber}>{program.programNumber}</span>
      <div className={styles.programWrapper}>
        <div className={styles.programWrapperName}>
          <span className={styles.programsListName}>{program.name && fileNameHandler(program.name)}</span>
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
          className={styles.programsListRefreshBtn}
          type="button"
          aria-label="refresh"
          onClick={() => handleRefreshProgram(program.hash)}
        >
          <img src={RefreshIllustration} alt="refresh" />
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
