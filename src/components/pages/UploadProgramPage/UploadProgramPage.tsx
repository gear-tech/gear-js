import React, { useEffect, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { getUserDataAction, transferBalanceSuccessAction } from 'store/actions/actions';
import { RootState } from 'store/reducers';

import { SocketService } from 'services/SocketService';

import { GEAR_BALANCE_TRANSFER_VALUE, GEAR_MNEMONIC_KEY, SWITCH_PAGE_TYPES } from 'consts';
import { routes } from 'routes';

import { BlockListAllUploaded } from 'components/blocks/BlocksList/BlockListAllUploaded';

import ProgramSwitch from '../../blocks/ProgramSwitch';
import UploadProgram from '../../blocks/UploadProgram';
import BlocksList from '../../blocks/BlocksList';
import { BlocksListUploaded } from '../../blocks/BlocksList/BlocksListUploaded';

import './UploadProgramPage.scss';

const UploadProgramPage = () => {

  const dispatch = useDispatch();

  const { user, isBalanceTransfered } = useSelector((state: RootState) => state.user)

  const socketServiceRef = useRef<any>(null);

  useEffect(() => {
    if (!user) {
      dispatch(getUserDataAction());
    }
    if (!socketServiceRef.current) {
      socketServiceRef.current = new SocketService(dispatch);
    }
    if (localStorage.getItem(GEAR_MNEMONIC_KEY) && !isBalanceTransfered && socketServiceRef.current) {
      socketServiceRef.current.transferBalance({
        value: GEAR_BALANCE_TRANSFER_VALUE
      });
      dispatch(transferBalanceSuccessAction());
    }
  }, [dispatch, isBalanceTransfered, user])

  const isUploadedProgramsPage = useRouteMatch(routes.uploadedPrograms);
  const isAllProgramsPage = useRouteMatch(routes.allPrograms);

  let currentPage = SWITCH_PAGE_TYPES.UPLOAD_PROGRAM;

  if (isUploadedProgramsPage) {
    currentPage = SWITCH_PAGE_TYPES.UPLOADED_PROGRAMS;
  } else if (isAllProgramsPage) {
    currentPage = SWITCH_PAGE_TYPES.ALL_PROGRAMS;
  }

  return (
    <div className="main-content-wrapper">
      <ProgramSwitch socketService={socketServiceRef.current} pageType={currentPage}/>
      {currentPage === SWITCH_PAGE_TYPES.UPLOAD_PROGRAM && (
        <>
          <UploadProgram socketService={socketServiceRef.current}/>
          <BlocksList/>
        </>
      )}
      {currentPage === SWITCH_PAGE_TYPES.UPLOADED_PROGRAMS && <BlocksListUploaded socketService={socketServiceRef.current}/>}
      {
        currentPage === SWITCH_PAGE_TYPES.ALL_PROGRAMS && <BlockListAllUploaded/>
      }
    </div>
  )
};

export default UploadProgramPage;
