import React, { useEffect, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { getUserDataAction } from 'store/actions/actions';
import { RootState } from 'store/reducers';

import { SocketService } from 'services/SocketService';

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

  const socketServiceRef = useRef<any>(null);

  useEffect(() => {
    if (!user) {
      dispatch(getUserDataAction());
    }
    if (!socketServiceRef.current) {
      socketServiceRef.current = new SocketService(dispatch);
    }
  }, [dispatch, user])

  return (
    <div className="main-content-wrapper">
      <ProgramSwitch showUploaded={showUploaded} socketService={socketServiceRef.current}/>
      {!showUploaded && (
        <>
          <UploadProgram socketService={socketServiceRef.current}/>
          <BlocksList/>
        </>
      )}
      {showUploaded && <BlocksListUploaded />}
    </div>
  )
};

export default UploadProgramPage;
