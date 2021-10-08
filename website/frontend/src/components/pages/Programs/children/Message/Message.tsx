import React, { useEffect, VFC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SocketService } from 'services/SocketService';
import { RootState } from 'store/reducers';
import { sendMessageResetAction } from 'store/actions/actions';
import { StatusPanel } from 'components/blocks/StatusPanel/StatusPanel';
import { MessageForm } from 'components/pages/Programs/children/Message/children/MessageForm/MessageForm';
import { PageHeader } from 'components/blocks/PageHeader/PageHeader';
import './Message.scss';
import { PAGE_TYPES } from 'consts';

type Props = {
  programHash: string;
  programName: string;
  socketService: SocketService;
  handleClose: () => void;
};

export const Message: VFC<Props> = ({ programHash, programName, socketService, handleClose }) => {
  const dispatch = useDispatch();

  const { messageSendingError, payloadType } = useSelector((state: RootState) => state.programs);

  let statusPanelText: string | null = null;

  if (messageSendingError) {
    statusPanelText = messageSendingError;
  }

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      if(event.key === 'Escape'){
        handleClose();
      }
    })
  }, [handleClose]);

  useEffect(() => {
    if (!payloadType) {
      socketService.getPayloadType(programHash);
    }
  }, [dispatch, payloadType, programHash, socketService]);


  return (
    <div className="message-form">
      <PageHeader programName={programName} handleClose={handleClose} pageType={PAGE_TYPES.MESSAGE_FORM_PAGE} />
      <MessageForm
        programHash={programHash}
        programName={programName}
      />
      {statusPanelText && (
        <StatusPanel
          onClose={() => {
            dispatch(sendMessageResetAction());
          }}
          statusPanelText={statusPanelText}
          isError={!!messageSendingError}
        />
      )}
    </div>
  );
};
