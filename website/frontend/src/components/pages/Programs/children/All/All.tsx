import React, { useEffect, useState, VFC } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Pagination } from 'components/Pagination/Pagination';
import { Meta } from 'components/Meta/Meta';
import { ProgramsLegend } from 'components/pages/Programs/children/ProgramsLegend/ProgramsLegend';
import { INITIAL_LIMIT_BY_PAGE } from 'consts';
import { ProgramModel } from 'types/program';
import MessageIcon from 'assets/images/message.svg';
import UploadIcon from 'assets/images/upload-cloud.svg';
import { UserProgram } from '../UserProgram/UserProgram';
import styles from './All.module.scss';
import { SearchForm } from '../../../../blocks/SearchForm/SearchForm';
import { URL_PARAMS } from 'consts';
import { getPrograms } from 'services';

type ProgramMessageType = {
  programName: string;
  programId: string;
};

export const All: VFC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageFromUrl = searchParams.has(URL_PARAMS.PAGE) ? Number(searchParams.get(URL_PARAMS.PAGE)) : 1;
  const queryFromUrl = searchParams.has(URL_PARAMS.QUERY) ? String(searchParams.get(URL_PARAMS.QUERY)) : '';

  const [query, setQuery] = useState(queryFromUrl);
  const [programs, setPrograms] = useState<ProgramModel[]>([]);
  const [programsCount, setProgramsCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [programMeta, setProgramMeta] = useState<ProgramMessageType | null>(null);

  useEffect(() => {
    const programParams = {
      limit: INITIAL_LIMIT_BY_PAGE,
      offset: (currentPage - 1) * INITIAL_LIMIT_BY_PAGE,
      term: query,
    };

    getPrograms(programParams).then(({ result }) => {
      setPrograms(result.programs);
      setProgramsCount(result.count);
    });
  }, [currentPage, query]);

  useEffect(() => {
    setCurrentPage(pageFromUrl);
  }, [pageFromUrl, setCurrentPage]);

  useEffect(() => {
    setQuery(queryFromUrl);
  }, [queryFromUrl, setQuery]);

  const handleOpenForm = (programId: string, programName?: string) => {
    if (programName) {
      setProgramMeta({
        programId,
        programName,
      });
    }
  };

  const handleCloseMetaForm = () => {
    setProgramMeta(null);
  };

  if (programMeta) {
    return (
      <Meta programId={programMeta.programId} programName={programMeta.programName} handleClose={handleCloseMetaForm} />
    );
  }

  const handleSearch = (value: string) => {
    const path = `/all-programs/?page=1${value ? `&query=${value}` : ``}`;

    setQuery(value);
    setCurrentPage(1);
    navigate(path);
  };

  return (
    <div className="all-programs">
      <div className={styles.paginationWrapper}>
        <span>Total results: {programsCount || 0}</span>
        <Pagination count={programsCount || 1} />
      </div>
      <div>
        <SearchForm query={query} placeholder="Find program" handleSearch={handleSearch} />
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
                  <Link to={`/send/message/${item.id}`} className={styles.allProgramsItemSendMessage}>
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
          <Pagination count={programsCount || 1} />
        </div>
      )}
    </div>
  );
};
