import React, { useCallback, useEffect, useState, VFC } from 'react';
import { useDispatch } from 'react-redux';
import { Metadata } from '@gear-js/api';
import { EventTypes } from 'types/events';
import { AddAlert } from 'store/actions/actions';
import { MessageForm } from 'components/pages/Programs/children/Message/children/MessageForm/MessageForm';
import { PageHeader } from 'components/blocks/PageHeader/PageHeader';
import './Message.scss';
import { PAGE_TYPES, RPC_METHODS } from 'consts';
import ServerRPCRequestService from '../../../../../services/ServerRPCRequestService';

type Props = {
  programHash: string;
  programName: string;
  handleClose: () => void;
};

export const Message: VFC<Props> = ({ programHash, programName, handleClose }) => {
  const dispatch = useDispatch();

  const [meta, setMeta] = useState<Metadata | null>(null);

  useEffect(() => {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMeta = useCallback(async () => {
    const apiRequest = new ServerRPCRequestService();

    const { result } = await apiRequest.getResource(RPC_METHODS.GET_METADATA, {
      programId: programHash,
    });

    return result.meta as Metadata;
  }, [programHash]);

  useEffect(() => {
    if (!meta) {
      getMeta()
        .then((res) => setMeta(res))
        .catch((err) => dispatch(AddAlert({ type: EventTypes.ERROR, message: err.message })));
    }
  }, [meta, getMeta, dispatch]);

  return (
    <div className="message-form">
      <PageHeader programName={programName} handleClose={handleClose} pageType={PAGE_TYPES.MESSAGE_FORM_PAGE} />
      {meta && <MessageForm programHash={programHash} programName={programName} meta={meta} />}
    </div>
  );
};
