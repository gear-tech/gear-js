import React, { useEffect, useState, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { createSelector } from 'reselect';
import {
  getUserProgramsAction,
  resetGasAction,
  resetProgramPayloadTypeAction,
  sendMessageResetAction,
  uploadMetaResetAction,
  getProgramAction,
  resetProgramAction,
} from 'store/actions/actions';
import { RootState } from 'store/reducers';
import { ProgramModel } from 'types/program';

import { INITIAL_LIMIT_BY_PAGE } from 'consts';

import { Message } from 'components/pages/Programs/children/Message/Message';
import { Meta } from 'components/Meta/Meta';
import { Pagination } from 'components/Pagination/Pagination';

import styles from './Recent.module.scss';
import { UserProgram } from '../UserProgram/UserProgram';

import { SearchForm } from '../../../../blocks/SearchForm/SearchForm';

type ProgramMessageType = {
  programName: string;
  programId: string;
};

const selectPrograms = createSelector(
  (state: RootState) => state.programs,
  (_ignore: any, completed: string) => completed,
  (programs, completed) => programs.programs && programs.programs.filter((item) => item.id.includes(completed))
);

export const Recent: VFC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const urlSearch = location.search;
  const pageFromUrl = urlSearch ? Number(urlSearch.split('=')[1]) : 1;

  const [search, setSearch] = useState('');

  const recentPrograms = useSelector((state: RootState) => selectPrograms(state, search));
  const recentProgramsCount = useSelector((state: RootState) => state.programs.programsCount);

  const [programMessage, setProgramMessage] = useState<ProgramMessageType | null>(null);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [programMeta, setProgramMeta] = useState<ProgramMessageType | null>(null);

  const onPageChange = (page: number) => setCurrentPage(page);

  const offset = (currentPage - 1) * INITIAL_LIMIT_BY_PAGE;

  useEffect(() => {
    dispatch(
      getUserProgramsAction({
        publicKeyRaw: localStorage.getItem('public_key_raw'),
        limit: INITIAL_LIMIT_BY_PAGE,
        offset,
      })
    );
  }, [dispatch, offset]);

  const handleOpenForm = (programId: string, programName?: string, isMessage?: boolean) => {
    if (programName) {
      if (isMessage) {
        setProgramMessage({
          programId,
          programName,
        });
      } else {
        setProgramMeta({
          programId,
          programName,
        });
      }
    }
  };

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

  if (programMessage) {
    return (
      <Message
        programId={programMessage.programId}
        programName={programMessage.programName}
        handleClose={handleCloseMessageForm}
      />
    );
  }

  if (programMeta) {
    return (
      <Meta programId={programMeta.programId} programName={programMeta.programName} handleClose={handleCloseMetaForm} />
    );
  }

  return (
    <div className={styles.blockList}>
      <div className={styles.paginationWrapper}>
        <span>Total results: {recentProgramsCount || 0}</span>
        <Pagination page={currentPage} count={recentProgramsCount || 1} onPageChange={onPageChange} />
      </div>
      <div>
        <SearchForm
          handleRemoveQuery={() => {
            setSearch('');
            dispatch(resetProgramAction());
          }}
          handleSearch={(val: string) => {
            setSearch(val);
            dispatch(getProgramAction(val));
          }}
          placeholder="Find program by ID"
        />
        <br />
      </div>
      {(recentPrograms && recentProgramsCount && (
        <div>
          {recentPrograms.map((program: ProgramModel) => (
            <UserProgram program={program} handleOpenForm={handleOpenForm} key={program.id} />
          ))}
        </div>
      )) ||
        null}

      {recentPrograms && recentPrograms.length > 0 && (
        <div className={styles.paginationBottom}>
          <Pagination page={currentPage} count={recentProgramsCount || 1} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
};
