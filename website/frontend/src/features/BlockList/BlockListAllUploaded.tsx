import React, { useEffect, useState, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { Pagination } from 'components/Pagination/Pagination';
import { Meta } from 'components/Meta/Meta';
import { INITIAL_LIMIT_BY_PAGE } from 'consts';
import { getAllProgramsAction, uploadMetaResetAction } from 'store/actions/actions';
import { RootState } from 'store/reducers';
import { ProgramModel } from 'types/program';

import MessageIcon from 'assets/images/message.svg';
import UploadIcon from 'assets/images/upload-cloud.svg';

import { UserProgram } from 'components/pages/Programs/children/UserProgram/UserProgram';

type ProgramMessageType = {
  programName: string;
  programId: string;
};

export const BlockListAllUploaded: VFC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const urlSearch = location.search;
  const pageFromUrl = urlSearch ? Number(urlSearch.split('=')[1]) : 1;

  const { allUploadedPrograms, allUploadedProgramsCount } = useSelector((state: RootState) => state.programs);

  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [programMeta, setProgramMeta] = useState<ProgramMessageType | null>(null);

  const onPageChange = (page: number) => setCurrentPage(page);

  const offset = (currentPage - 1) * INITIAL_LIMIT_BY_PAGE;

  useEffect(() => {
    dispatch(getAllProgramsAction({ limit: INITIAL_LIMIT_BY_PAGE, offset, term: '' }));
  }, [dispatch, offset]);

  const handleOpenForm = (programId: string, programName?: string) => {
    if (programName) {
      setProgramMeta({
        programId,
        programName,
      });
    }
  };

  const handleCloseMetaForm = () => {
    dispatch(uploadMetaResetAction());
    setProgramMeta(null);
  };

  if (programMeta) {
    return (
      <Meta programId={programMeta.programId} programName={programMeta.programName} handleClose={handleCloseMetaForm} />
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
              <div className="all-programs--item" key={item.id}>
                <p className="all-programs--item__hash">{item.id}</p>
                <div className="programs-list--btns">
                  <Link className="programs-list__message-btn" to={`/send/message/${item.id}`}>
                    <img src={MessageIcon} alt="Send message to program" />
                  </Link>
                  <button
                    className="all-programs--item__upload"
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
      {(allUploadedPrograms && allUploadedPrograms.length && (
        <div className="pagination-bottom">
          <Pagination page={currentPage} count={allUploadedProgramsCount || 1} onPageChange={onPageChange} />
        </div>
      )) ||
        null}
    </div>
  );
};
