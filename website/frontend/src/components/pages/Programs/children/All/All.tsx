import React, { useEffect, useState, VFC } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { Pagination } from 'components/Pagination/Pagination';
import { Meta } from 'components/Meta/Meta';
import { ProgramsLegend } from 'components/pages/Programs/children/ProgramsLegend/ProgramsLegend';
import { INITIAL_LIMIT_BY_PAGE } from 'consts';
import { uploadMetaResetAction } from 'store/actions/actions';
import { ProgramModel } from 'types/program';
import MessageIcon from 'assets/images/message.svg';
import UploadIcon from 'assets/images/upload-cloud.svg';
import { UserProgram } from '../UserProgram/UserProgram';
import styles from './All.module.scss';
import { SearchForm } from '../../../../blocks/SearchForm/SearchForm';
import { getPrograms } from 'services';

type ProgramMessageType = {
  programName: string;
  programId: string;
};

export const All: VFC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const pageFromUrl = searchParams.has('page') ? Number(searchParams.get('page')) : 1;

  const [term, setTerm] = useState('');
  const [programs, setPrograms] = useState<ProgramModel[]>([]);
  const [programsCount, setProgramsCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [programMeta, setProgramMeta] = useState<ProgramMessageType | null>(null);

  const onPageChange = (page: number) => setCurrentPage(page);

  useEffect(() => {
    const programParams = { limit: INITIAL_LIMIT_BY_PAGE, offset: (currentPage - 1) * INITIAL_LIMIT_BY_PAGE, term };

    getPrograms(programParams).then(({ result }) => {
      setPrograms(result.programs);
      setProgramsCount(result.count);
    });
  }, [currentPage, term]);

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
      <div className={styles.paginationWrapper}>
        <span>Total results: {programsCount || 0}</span>
        <Pagination page={currentPage} count={programsCount || 1} onPageChange={onPageChange} />
      </div>
      <div>
        <SearchForm
          handleRemoveQuery={() => {
            setTerm('');
          }}
          handleSearch={(val: string) => {
            setTerm(val);
          }}
          placeholder="Find program"
        />
        <br />
      </div>
      <ProgramsLegend />
      <div className={styles.allProgramsList}>
        {(programs &&
          programsCount &&
          programs.map((item: ProgramModel) => {
            if (item.name && item.name !== 'name.wasm') {
              return <UserProgram program={item} handleOpenForm={handleOpenForm} key={item.id} />;
            }
            return (
              <div className={styles.allProgramsItem} key={item.id}>
                <p className={styles.allProgramsItemHash}>{item.id}</p>
                <div className={styles.programsListBtns}>
                  <Link to={`/send-message/${item.id}`} className={styles.allProgramsItemSendMessage}>
                    <img src={MessageIcon} alt="Send message to program" />
                  </Link>
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
      {programs && programsCount > 0 && (
        <div className={styles.paginationBottom}>
          <Pagination page={currentPage} count={programsCount || 1} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
};
