import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { INITIAL_LIMIT_BY_PAGE } from 'consts';

import { ALL_PROGRAMS_TEST } from 'fixtures';

import { Pagination } from 'components/Pagination';
import { SearchForm } from 'components/blocks/SearchForm';
import { getProgramsListAction } from 'store/actions/actions';
import { RootState } from 'store/reducers';

import UploadIcon from 'images/upload.svg';
import RemoveQueryIcon from 'images/remove-query.svg';
import { UploadedProgramModel } from 'types/program';

const BlockListAllUploaded = () => {

    const dispatch = useDispatch();

    const { allUploadedPrograms, uploadedProgramsCount } = useSelector((state: RootState) => state.programs);

    const [currentPage, setCurrentPage] = useState(0);
    const [searchQueries, setSearchQueries] = useState<string[]>([]);

    console.log(allUploadedPrograms, uploadedProgramsCount)

    const onPageChange = (page: number) => setCurrentPage(page);

    const offset = currentPage * INITIAL_LIMIT_BY_PAGE;

    useEffect(() => {
        dispatch(getProgramsListAction({ limit: INITIAL_LIMIT_BY_PAGE, offset }));
    }, [dispatch, offset]);

    const handleAddQuery = (searchQuery: string) => {
        if (!searchQueries.find(item => item === searchQuery)) {
            setSearchQueries([...searchQueries, searchQuery]);
        }
    }

    const handleRemoveQuery = (query: string) => {
        setSearchQueries([...searchQueries.filter(item => item !== query)])
    }

    const handleRemoveAllQueries = () => {
        setSearchQueries([]);
    }

    return (
        <div className="all-programs">
            <SearchForm handleSearch={handleAddQuery} handleRemoveAllQueries={handleRemoveAllQueries}/>
            <div className="all-programs--queries">
                {
                    searchQueries.length && searchQueries.map(query => (
                        <div className="all-programs--query">
                            <span>Hash: {query}</span>
                            <button className="all-programs--query__remove" type="button" onClick={() => handleRemoveQuery(query)}>
                                <img src={RemoveQueryIcon} alt="remove-query" />
                            </button>
                        </div>
                    )) || null
                }
            </div>
            <div className="all-programs--pagination">
                <span>Total results: {ALL_PROGRAMS_TEST.length}</span>
                <Pagination 
                    page={currentPage}
                    count={13}
                    onPageChange={onPageChange}/>
            </div>
            <div className="all-programs--list">
                {
                    ALL_PROGRAMS_TEST && ALL_PROGRAMS_TEST.length && ALL_PROGRAMS_TEST.map((item: UploadedProgramModel) => (
                        <div className="all-programs--item" key={item.hash}>
                            <p className="all-programs--item__hash">{item.hash}</p>
                            <button className="all-programs--item__upload" type="button">
                                <img src={UploadIcon} alt="upload-program" />
                            </button>
                        </div>
                    ))
                }
            </div>
            <div className="all-programs--bottom">
                <Pagination 
                    page={currentPage}
                    count={13}
                    onPageChange={onPageChange}/>
            </div>
        </div>
    )
}

export { BlockListAllUploaded };