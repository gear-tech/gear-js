import { useState } from 'react';
import type { Hex } from 'viem';

import { Tabs, UploadIdlButton } from '@/components';
import { ProgramMessagesTable } from '@/features/messages';
import { useInitProgram, useSendInjectedTransaction, useSendProgramMessage } from '@/features/programs/lib';

import { type FormattedPayloadValue, useSails } from '../../lib';
import { SailsActionGroup } from '../sails-action-group';

import styles from './sails-program-actions.module.scss';

const TABS_NO_IDL = ['IDL', 'Messages'];
const TABS_WITH_IDL = ['Call offchain', 'Call onchain', 'Messages'];

type Props = {
  programId: Hex;
  idl: string | null | undefined;
  onSaveIdl: (idl: string) => void;
  init: { isRequired: boolean; isEnabled: boolean; tooltip: string; onSuccess: () => void };
  hasExecutableBalance: boolean;
};

const SailsProgramPanel = ({ programId, idl, onSaveIdl, init, hasExecutableBalance }: Props) => {
  const { data: sails } = useSails(idl ?? '');
  const [tabIndex, setTabIndex] = useState(0);

  const sendInjectedTx = useSendInjectedTransaction(programId, sails);
  const sendMessage = useSendProgramMessage(programId, sails);
  const send = tabIndex === 0 ? sendInjectedTx : sendMessage;

  const initProgram = useInitProgram(programId, sails);

  const tabs = idl ? TABS_WITH_IDL : TABS_NO_IDL;
  const messagesTabIndex = tabs.length - 1;
  const isMessagesTab = tabIndex === messagesTabIndex;

  const renderServiceActions = () =>
    Object.entries(sails!.services).map(([serviceName, service]) => {
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

      return <SailsActionGroup key={serviceName} name={serviceName} sails={sails!} items={[...queries, ...functions]} />;
    });

  const renderCtors = () => {
    const items = Object.entries(sails!.ctors).map(([ctorName, meta]) => ({
      id: `ctor:${ctorName}`,
      name: ctorName,
      action: 'Initialize',
      isEnabled: init.isEnabled && hasExecutableBalance,
      tooltip: init.tooltip,
      args: meta.args,
      encode: meta.encodePayload,
      onSubmit: (payload: FormattedPayloadValue) =>
        initProgram.mutateAsync({ ctorName, payload }).then(() => init.onSuccess()),
    }));

    return (
      <div className={styles.constructors}>
        <SailsActionGroup name="Constructors" sails={sails!} items={items} />
        {!hasExecutableBalance && (
          <p className={styles.constructorsNotice}>
            Please top up Executable Balance first before initializing the program.
          </p>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (isMessagesTab) return <ProgramMessagesTable programId={programId} />;

    if (!idl)
      return (
        <div className={styles.emptyState}>
          <p>No IDL uploaded. Please upload an IDL file to initialize and interact with the program.</p>
          <UploadIdlButton onSaveIdl={onSaveIdl} />
        </div>
      );

    if (!sails) return null;
    if (init.isRequired) return renderCtors();
    return renderServiceActions();
  };

  return (
    <>
      <Tabs tabs={tabs} tabIndex={tabIndex} onTabIndexChange={setTabIndex} className={styles.tabs} />

      <div className={styles.list}>{renderContent()}</div>
    </>
  );
};

export { SailsProgramPanel };
