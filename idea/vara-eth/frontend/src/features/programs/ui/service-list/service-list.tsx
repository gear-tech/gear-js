import { HexString } from '@vara-eth/api';
import { useState } from 'react';

import { Tabs } from '@/components';
import { SailsList } from '@/features/sails/components/sails-list';

import { useInitProgram, useSails, useSendInjectedTransaction, useSendProgramMessage } from '../../lib';

import styles from './service-list.module.scss';

const tabs = ['Call offchain', 'Call onchain'];

type Props = {
  programId: HexString;
  idl: string;
  isInitialized: boolean | undefined;
};

const ServiceList = ({ programId, idl, isInitialized }: Props) => {
  const { data: sails } = useSails(idl);
  const [tabIndex, setTabIndex] = useState(0);

  const sendInjectedTx = useSendInjectedTransaction(programId, idl);
  const sendMessage = useSendProgramMessage(programId, idl);
  const initProgram = useInitProgram(programId, idl);

  if (!sails) return;

  const getMessagesList = () =>
    Object.entries(sails.services).map(([name, service]) => {
      const functions = Object.entries(service.functions);
      const queries = Object.entries(service.queries);
      const messages = [...queries, ...functions];

      const list = messages.map(([functionName, { args }], index) => {
        const isQuery = index < queries.length;

        const onSubmit = (payload: HexString) => {
          const isOffchain = tabIndex === 0;
          const send = isOffchain ? sendInjectedTx : sendMessage;

          return send.mutateAsync({ serviceName: name, messageName: functionName, isQuery, payload });
        };

        return { name: functionName, action: isQuery ? 'Read' : 'Write', args, onSubmit };
      });

      return { name, counter: messages.length, list };
    });

  const getCtorsList = () => {
    const ctorEntries = Object.entries(sails.ctors);

    const list = ctorEntries.map(([ctorName, { args }]) => {
      const onSubmit = (payload: HexString) => initProgram.mutateAsync({ ctorName, payload });

      return { action: 'Initialize', name: ctorName, args, onSubmit };
    });

    return [{ name: 'Constructor', counter: ctorEntries.length, list }];
  };

  return (
    <div>
      {isInitialized ? (
        <>
          <Tabs
            tabs={tabs}
            tabIndex={tabIndex}
            onTabIndexChange={(index) => setTabIndex(index)}
            className={styles.tabs}
          />

          <SailsList value={getMessagesList()} sails={sails} />
        </>
      ) : (
        <SailsList value={getCtorsList()} sails={sails} />
      )}
    </div>
  );
};

export { ServiceList };
