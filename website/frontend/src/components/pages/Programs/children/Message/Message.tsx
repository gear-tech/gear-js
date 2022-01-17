import React, { useCallback, useEffect, useState, VFC } from 'react';
import { useDispatch } from 'react-redux';
import { Loader } from 'react-feather';
import { getTypeStructure, Metadata, parseHexTypes } from '@gear-js/api';
import { EventTypes } from 'types/events';
import { AddAlert } from 'store/actions/actions';
import { MessageForm } from 'components/pages/Programs/children/Message/children/MessageForm/MessageForm';
import { PageHeader } from 'components/blocks/PageHeader/PageHeader';
import './Message.scss';
import { PAGE_TYPES, RPC_METHODS } from 'consts';
import ServerRPCRequestService, { RPCResponseError } from 'services/ServerRPCRequestService';
import { GetMetaResponse } from 'api/responses';
import { MetaParam } from 'utils/meta-parser';
import { isDevChain, getMetaFromLocalProgram } from 'helpers';

type Props = {
  programId: string;
  programName: string;
  handleClose: () => void;
};

export const Message: VFC<Props> = ({ programId, programName, handleClose }) => {
  const dispatch = useDispatch();

  const [meta, setMeta] = useState<Metadata | null>(null);
  const [ready, setReady] = useState(false);
  const [types, setTypes] = useState<MetaParam | null>(null);

  useEffect(() => {
    if (meta && meta.types && meta.handle_input) {
      const displayedTypes = parseHexTypes(meta.types);
      const inputType = getTypeStructure(meta.handle_input, displayedTypes);

      setTypes(inputType);
    }
  }, [meta, setTypes]);

  useEffect(() => {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getMeta = useCallback(async (id: string) => {
    const apiRequest = new ServerRPCRequestService();

    return apiRequest.callRPC<GetMetaResponse>(RPC_METHODS.GET_METADATA, { id });
  }, []);

  const fetchMeta = isDevChain() ? getMetaFromLocalProgram : getMeta;

  useEffect(() => {
    if (!meta) {
      fetchMeta(programId)
        .then((response) => {
          setMeta(JSON.parse(response.result.meta) ?? null);
        })
        .catch((err: RPCResponseError) => dispatch(AddAlert({ type: EventTypes.ERROR, message: err.message })))
        .finally(() => {
          setReady(true);
        });
    }
  }, [meta, programId, fetchMeta, dispatch]);

  if (ready) {
    return (
      <div className="message-form">
        <PageHeader programName={programName} handleClose={handleClose} pageType={PAGE_TYPES.MESSAGE_FORM_PAGE} />
        <MessageForm programId={programId} programName={programName} meta={meta} types={types} />
      </div>
    );
  }
  return <Loader color="#fff" className="animation-rotate" />;
};
