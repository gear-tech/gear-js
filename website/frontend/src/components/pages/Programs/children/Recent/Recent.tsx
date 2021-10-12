import React, { useEffect, useState, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserProgramsAction,
  resetGasAction,
  resetProgramPayloadTypeAction,
  sendMessageResetAction,
  uploadMetaResetAction,
} from 'store/actions/actions';
import { RootState } from 'store/reducers';

import { INITIAL_LIMIT_BY_PAGE } from 'consts';

import { Message } from 'components/pages/Programs/children/Message/Message';
import { Meta } from 'components/Meta/Meta';
import { Pagination } from 'components/Pagination/Pagination';

import styles from './Recent.module.scss';
import { UserProgram } from '../UserProgram/UserProgram';

type ProgramMessageType = {
  programName: string;
  programHash: string;
};

export const Recent: VFC = () => {
  const dispatch = useDispatch();

  const { programs, programsCount } = useSelector((state: RootState) => state.programs);

  const [programMessage, setProgramMessage] = useState<ProgramMessageType | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [programMeta, setProgramMeta] = useState<ProgramMessageType | null>(null);

  const onPageChange = (page: number) => setCurrentPage(page);

  const offset = currentPage * INITIAL_LIMIT_BY_PAGE;

  const handleCloseMessageForm = () => {
    dispatch(sendMessageResetAction());
    dispatch(resetGasAction());
    dispatch(resetProgramPayloadTypeAction());
    setProgramMessage(null);
  };

  const handleCloseMetaForm = () => {
    dispatch(uploadMetaResetAction());
    setProgramMeta(null);
  };

  const handleOpenForm = (programHash: string, programName?: string, isMessage?: boolean) => {
    if (programName) {
      if (isMessage) {
        setProgramMessage({
          programHash,
          programName,
        });
      } else {
        setProgramMeta({
          programHash,
          programName,
        });
      }
    }
  };

  useEffect(() => {
    dispatch(
      getUserProgramsAction({
        publicKeyRaw: localStorage.getItem('public_key_raw'),
        limit: INITIAL_LIMIT_BY_PAGE,
        offset,
      })
    );
  }, [dispatch, offset]);

  if (programMessage) {
    return (
      <Message
        programHash={programMessage.programHash}
        programName={programMessage.programName}
        handleClose={handleCloseMessageForm}
      />
    );
  }

  if (programMeta) {
    return (
      <Meta
        programHash={programMeta.programHash}
        programName={programMeta.programName}
        handleClose={handleCloseMetaForm}
      />
    );
  }
  return (
    <div className={styles.blockList}>
      <div className={styles.paginationWrapper}>
        <span>Total results: {programsCount || 0}</span>
        <Pagination page={currentPage} count={programsCount || 0} onPageChange={onPageChange} />
      </div>

      {(programs && programs.length > 0 && (
        <div>
          {programs.map((program) => (
            <UserProgram program={program} handleOpenForm={handleOpenForm} key={program.hash} />
          ))}
        </div>
      )) || <div className={styles.noMessage}>There are no uploaded programs</div>}

      {programs && programs.length > 0 && (
        <div className={styles.paginationBottom}>
          <Pagination page={currentPage} count={programsCount || 0} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
};
