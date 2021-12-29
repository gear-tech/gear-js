import React, { useEffect, useState, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { createSelector } from 'reselect';
import { Pagination } from 'components/Pagination/Pagination';
import { Message } from 'components/pages/Programs/children/Message/Message';
import { Meta } from 'components/Meta/Meta';
import { INITIAL_LIMIT_BY_PAGE } from 'consts';
import {
  getAllProgramsAction,
  resetGasAction,
  resetProgramPayloadTypeAction,
  sendMessageResetAction,
  uploadMetaResetAction,
  getProgramAction,
  resetProgramAction,
} from 'store/actions/actions';
import { RootState } from 'store/reducers';
import { ProgramModel } from 'types/program';
import MessageIcon from 'assets/images/message.svg';
import UploadIcon from 'assets/images/upload.svg';
import { UserProgram } from '../UserProgram/UserProgram';
import styles from './All.module.scss';
import { SearchForm } from '../../../../blocks/SearchForm/SearchForm';

type ProgramMessageType = {
  programName: string;
  programId: string;
};

const selectPrograms = createSelector(
  (state: RootState) => state.programs,
  (_ignore: any, completed: string) => completed,
  (programs, completed) =>
    programs.allUploadedPrograms && programs.allUploadedPrograms.filter((item) => item.id.includes(completed))
);

export const All: VFC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const urlSearch = location.search;
  const pageFromUrl = urlSearch ? Number(urlSearch.split('=')[1]) : 1;

  const [search, setSearch] = useState('');

  const allPrograms = useSelector((state: RootState) => selectPrograms(state, search));
  const allProgramsCount = useSelector((state: RootState) => state.programs.allUploadedProgramsCount);

  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [programMessage, setProgramMessage] = useState<ProgramMessageType | null>(null);
  const [programMeta, setProgramMeta] = useState<ProgramMessageType | null>(null);

  const onPageChange = (page: number) => setCurrentPage(page);

  const offset = (currentPage - 1) * INITIAL_LIMIT_BY_PAGE;

  useEffect(() => {
    dispatch(getAllProgramsAction({ limit: INITIAL_LIMIT_BY_PAGE, offset }));
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
    <div className="all-programs">
      <div className={styles.paginationWrapper}>
        <span>Total results: {allProgramsCount || 0}</span>
        <Pagination page={currentPage} count={allProgramsCount || 1} onPageChange={onPageChange} />
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
        />
        <br />
      </div>
      <div className={styles.allProgramsList}>
        {(allPrograms &&
          allProgramsCount &&
          allPrograms.map((item: ProgramModel) => {
            if (item.name && item.name !== 'name.wasm') {
              return <UserProgram program={item} handleOpenForm={handleOpenForm} key={item.id} />;
            }
            return (
              <div className={styles.allProgramsItem} key={item.id}>
                <p className={styles.allProgramsItemHash}>{item.id}</p>
                <div className={styles.programsListBtns}>
                  <button type="button" aria-label="refresh" onClick={() => handleOpenForm(item.id, item.name, true)}>
                    <img src={MessageIcon} alt="message" />
                  </button>
                  <button
                    className={styles.allProgramsItemUpload}
                    type="button"
                    onClick={() => handleOpenForm(item.id, item.name)}
                  >
                    <img src={UploadIcon} alt="upload-program" />
                  </button>
                </div>
              </div>
            );
          })) ||
          null}
      </div>
      {allPrograms && allPrograms.length > 0 && (
        <div className={styles.paginationBottom}>
          <Pagination page={currentPage} count={allProgramsCount || 1} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
};
