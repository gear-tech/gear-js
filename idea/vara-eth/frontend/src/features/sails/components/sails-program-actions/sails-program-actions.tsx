import { useEffect, useState } from 'react';
import type { Hex } from 'viem';

import { Tabs, UploadIdlButton } from '@/components';
import { ProgramMessagesTable } from '@/features/messages';
import { useInitProgram, useSendInjectedTransaction, useSendProgramMessage } from '@/features/programs/lib';

import { type FormattedPayloadValue, useSails } from '../../lib';
import { SailsActionGroup } from '../sails-action-group';

import styles from './sails-program-actions.module.scss';

const MESSAGES_TAB = 'Messages';
const IDL_TAB = 'IDL';
const OFFCHAIN_TAB = 'Call offchain';
const ONCHAIN_TAB = 'Call onchain';

const TABS_LOADING = [MESSAGES_TAB];
const TABS_NO_IDL = [MESSAGES_TAB, IDL_TAB];
const TABS_WITH_IDL = [MESSAGES_TAB, OFFCHAIN_TAB, ONCHAIN_TAB];

type Props = {
  programId: Hex;
  idl: string | null | undefined;
  isLoading: boolean;
  onSaveIdl: (idl: string) => void;
  init: { isRequired: boolean; isEnabled: boolean; tooltip: string; onSuccess: () => void };
  hasExecutableBalance: boolean;
};

const SailsProgramPanel = ({ programId, idl, isLoading, onSaveIdl, init, hasExecutableBalance }: Props) => {
  const { data: sails } = useSails(idl ?? '');
  const [tabIndex, setTabIndex] = useState(0);
  const tabs = isLoading ? TABS_LOADING : idl ? TABS_WITH_IDL : TABS_NO_IDL;
  const activeTab = tabs[tabIndex] ?? MESSAGES_TAB;

  useEffect(() => {
    const maxTabIndex = tabs.length - 1;
    setTabIndex((currentTabIndex) => (currentTabIndex > maxTabIndex ? 0 : currentTabIndex));
  }, [tabs]);

  const sendInjectedTx = useSendInjectedTransaction(programId, sails);
  const sendMessage = useSendProgramMessage(programId, sails);
  const send = activeTab === OFFCHAIN_TAB ? sendInjectedTx : sendMessage;

  const initProgram = useInitProgram(programId, sails);

  const isMessagesTab = activeTab === MESSAGES_TAB;

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

      return (
        <SailsActionGroup key={serviceName} name={serviceName} sails={sails!} items={[...queries, ...functions]} />
      );
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

    if (isLoading) return null;

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
