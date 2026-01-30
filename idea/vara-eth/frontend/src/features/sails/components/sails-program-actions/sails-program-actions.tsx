import { HexString } from '@vara-eth/api';
import { useState } from 'react';

import { Tabs } from '@/components';
import { useSendInjectedTransaction, useInitProgram, useSendProgramMessage } from '@/features/programs/lib';

import { useSails } from '../../lib';
import { SailsActionGroup } from '../sails-action-group';

import styles from './sails-program-actions.module.scss';

const tabs = ['Call offchain', 'Call onchain'];

type Props = {
  programId: HexString;
  idl: string;
  isInitialized: boolean | undefined;
};

const SailsProgramActions = ({ programId, idl, isInitialized }: Props) => {
  const { data: sails } = useSails(idl);
  const [tabIndex, setTabIndex] = useState(0);

  const sendInjectedTx = useSendInjectedTransaction(programId, sails);
  const sendMessage = useSendProgramMessage(programId, sails);
  const send = tabIndex === 0 ? sendInjectedTx : sendMessage;

  const initProgram = useInitProgram(programId, sails);

  if (!sails) return;

  const renderMessages = () =>
    Object.entries(sails.services).map(([serviceName, service]) => {
      const queries = Object.entries(service.queries).map(([messageName, meta]) => ({
        id: `query:${serviceName}:${messageName}`,
        name: messageName,
        action: 'Read',
        args: meta.args,
        encode: meta.encodePayload,
        onSubmit: (payload: HexString) => send.mutateAsync({ serviceName, messageName, isQuery: true, payload }),
      }));

      const functions = Object.entries(service.functions).map(([messageName, meta]) => ({
        id: `fn:${serviceName}:${messageName}`,
        name: messageName,
        action: 'Write',
        args: meta.args,
        encode: meta.encodePayload,
        onSubmit: (payload: HexString) => send.mutateAsync({ serviceName, messageName, isQuery: false, payload }),
      }));

      return <SailsActionGroup key={serviceName} name={serviceName} sails={sails} items={[...queries, ...functions]} />;
    });

  const renderCtors = () => {
    const items = Object.entries(sails.ctors).map(([ctorName, meta]) => ({
      id: `ctor:${ctorName}`,
      name: ctorName,
      action: 'Initialize',
      args: meta.args,
      encode: meta.encodePayload,
      onSubmit: (payload: HexString) => initProgram.mutateAsync({ ctorName, payload }),
    }));

    return <SailsActionGroup name="Constructors" sails={sails} items={items} />;
  };

  return (
    <>
      {isInitialized && (
        <Tabs
          tabs={tabs}
          tabIndex={tabIndex}
          onTabIndexChange={(index) => setTabIndex(index)}
          className={styles.tabs}
        />
      )}

      <div className={styles.list}>{isInitialized ? renderMessages() : renderCtors()}</div>
    </>
  );
};

export { SailsProgramActions };
