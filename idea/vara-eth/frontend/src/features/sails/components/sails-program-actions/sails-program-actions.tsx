import { useState } from 'react';
import { Hex } from 'viem';

import { Tabs } from '@/components';
import { useSendInjectedTransaction, useInitProgram, useSendProgramMessage } from '@/features/programs/lib';

import { FormattedPayloadValue, useSails } from '../../lib';
import { SailsActionGroup } from '../sails-action-group';

import styles from './sails-program-actions.module.scss';

const tabs = ['Call offchain', 'Call onchain'];

type Props = {
  programId: Hex;
  idl: string;
  init: { isRequired: boolean; isEnabled: boolean; onSuccess: () => void };
};

const SailsProgramActions = ({ programId, idl, init }: Props) => {
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
        onSubmit: (payload: FormattedPayloadValue) =>
          send.mutateAsync({ serviceName, messageName, isQuery: true, payload }),
      }));

      const functions = Object.entries(service.functions).map(([messageName, meta]) => ({
        id: `fn:${serviceName}:${messageName}`,
        name: messageName,
        action: 'Write',
        args: meta.args,
        encode: meta.encodePayload,
        onSubmit: (payload: FormattedPayloadValue) =>
          send.mutateAsync({ serviceName, messageName, isQuery: false, payload }),
      }));

      return <SailsActionGroup key={serviceName} name={serviceName} sails={sails} items={[...queries, ...functions]} />;
    });

  const renderCtors = () => {
    const items = Object.entries(sails.ctors).map(([ctorName, meta]) => ({
      id: `ctor:${ctorName}`,
      name: ctorName,
      action: 'Initialize',
      isEnabled: init.isEnabled,
      args: meta.args,
      encode: meta.encodePayload,
      onSubmit: (payload: FormattedPayloadValue) =>
        initProgram.mutateAsync({ ctorName, payload }).then(() => init.onSuccess()),
    }));

    return <SailsActionGroup name="Constructors" sails={sails} items={items} />;
  };

  return (
    <>
      {!init.isRequired && (
        <Tabs
          tabs={tabs}
          tabIndex={tabIndex}
          onTabIndexChange={(index) => setTabIndex(index)}
          className={styles.tabs}
        />
      )}

      <div className={styles.list}>{init.isRequired ? renderCtors() : renderMessages()}</div>
    </>
  );
};

export { SailsProgramActions };
