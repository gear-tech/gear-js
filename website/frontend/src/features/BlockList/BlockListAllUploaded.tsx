import React, { useEffect, useState, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
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

import { UserProgram } from 'components/pages/Programs/children/UserProgram/UserProgram';

type ProgramMessageType = {
  programName: string;
  programHash: string;
};

export const BlockListAllUploaded: VFC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const urlSearch = location.search;
  const pageFromUrl = urlSearch ? Number(urlSearch.split('=')[1]) : 1;

  const { allUploadedPrograms, allUploadedProgramsCount } = useSelector((state: RootState) => state.programs);

  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [programMessage, setProgramMessage] = useState<ProgramMessageType | null>(null);
  const [programMeta, setProgramMeta] = useState<ProgramMessageType | null>(null);

  const onPageChange = (page: number) => setCurrentPage(page);

  const offset = (currentPage - 1) * INITIAL_LIMIT_BY_PAGE;

  useEffect(() => {
    dispatch(getAllProgramsAction({ limit: INITIAL_LIMIT_BY_PAGE, offset }));
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
      <div className="pagination-wrapper">
        <span>Total results: {allUploadedProgramsCount || 0}</span>
        <Pagination page={currentPage} count={allUploadedProgramsCount || 1} onPageChange={onPageChange} />
      </div>
      <div className="all-programs--list">
        {(allUploadedPrograms &&
          allUploadedPrograms.length &&
          allUploadedPrograms.map((item: ProgramModel) => {
            if (item.name && item.name !== 'name.wasm') {
              return <UserProgram program={item} handleOpenForm={handleOpenForm} />;
            }
            return (
              <div className="all-programs--item" key={item.hash}>
                <p className="all-programs--item__hash">{item.hash}</p>
                <div className="programs-list--btns">
                  <button
                    className="programs-list__message-btn"
                    type="button"
                    aria-label="refresh"
                    onClick={() => handleOpenForm(item.hash, item.name, true)}
                  >
                    <img src={MessageIcon} alt="message" />
                  </button>
                  <button
                    className="all-programs--item__upload"
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
      {(allUploadedPrograms && allUploadedPrograms.length && (
        <div className="pagination-bottom">
          <Pagination page={currentPage} count={allUploadedProgramsCount || 1} onPageChange={onPageChange} />
        </div>
      )) ||
        null}
    </div>
  );
};
