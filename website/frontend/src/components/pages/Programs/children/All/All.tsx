import React, { useEffect, useState, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  programHash: string;
};

const selectCompletedTodosCount = createSelector(
  (state: RootState) => state.programs,
  (_ignore: any, completed: string) => completed,
  (programs, completed) =>
    programs.allUploadedPrograms && programs.allUploadedPrograms.filter((item) => item.hash.includes(completed))
);

export const All: VFC = () => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');

  const { allUploadedProgramsCount } = useSelector((state: RootState) => state.programs);

  const allUploadedPrograms = useSelector((state: RootState) => selectCompletedTodosCount(state, search));

  const [currentPage, setCurrentPage] = useState(0);
  const [programMessage, setProgramMessage] = useState<ProgramMessageType | null>(null);
  const [programMeta, setProgramMeta] = useState<ProgramMessageType | null>(null);

  const onPageChange = (page: number) => setCurrentPage(page);

  const offset = currentPage * INITIAL_LIMIT_BY_PAGE;

  useEffect(() => {
    dispatch(getAllProgramsAction({ offset }));
  }, [dispatch, offset]);

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
    <div className="all-programs">
      <div className={styles.paginationWrapper}>
        <span>Total results: {allUploadedProgramsCount}</span>
        <Pagination page={currentPage} count={allUploadedProgramsCount || 0} onPageChange={onPageChange} />
      </div>
      <div>
        <SearchForm
          handleRemoveQuery={() => {
            setSearch('');
          }}
          handleSearch={(val: string) => {
            setSearch(val);
          }}
        />
        <br />
      </div>
      <div className={styles.allProgramsList}>
        {(allUploadedPrograms &&
          allUploadedPrograms.length &&
          allUploadedPrograms.map((item: ProgramModel) => {
            if (item.name && item.name !== 'name.wasm') {
              return <UserProgram program={item} handleOpenForm={handleOpenForm} key={item.hash} />;
            }
            return (
              <div className={styles.allProgramsItem} key={item.hash}>
                <p className={styles.allProgramsItemHash}>{item.hash}</p>
                <div className={styles.programsListBtns}>
                  <button type="button" aria-label="refresh" onClick={() => handleOpenForm(item.hash, item.name, true)}>
                    <img src={MessageIcon} alt="message" />
                  </button>
                  <button
                    className={styles.allProgramsItemUpload}
                    type="button"
                    onClick={() => handleOpenForm(item.hash, item.name)}
                  >
                    <img src={UploadIcon} alt="upload-program" />
                  </button>
                </div>
              </div>
            );
          })) ||
          null}
      </div>
      {allUploadedPrograms && allUploadedPrograms.length > 0 && (
        <div className={styles.paginationBottom}>
          <Pagination page={currentPage} count={allUploadedProgramsCount || 0} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
};
