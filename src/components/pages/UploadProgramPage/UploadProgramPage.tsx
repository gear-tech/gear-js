import React, { useEffect} from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { getUserDataAction } from 'store/actions/actions';
import { RootState } from 'store/reducers';

import ProgramSwitch from '../../blocks/ProgramSwitch';
import UploadProgram from '../../blocks/UploadProgram';
import BlocksList from '../../blocks/BlocksList';
import { BlocksListUploaded } from '../../blocks/BlocksList/BlocksListUploaded';

import './UploadProgramPage.scss';

type UploadProgramPageType = {
  showUploaded: boolean;
};

const UploadProgramPage = ({ showUploaded }: UploadProgramPageType) => {

  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    if (!user) {
      dispatch(getUserDataAction());
    }    
  }, [dispatch, user])

  return (
    <div className="main-content-wrapper">
      <ProgramSwitch showUploaded={showUploaded}/>
      {!showUploaded && (
        <>
          <UploadProgram />
          <BlocksList />
        </>
      )}
      {showUploaded && <BlocksListUploaded />}
    </div>
  )
};

export default UploadProgramPage;
