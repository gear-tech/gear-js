import { useEffect, useState } from 'react';
import type { Hex } from 'viem';

import { Tabs, UploadIdlButton } from '@/components';
import { ProgramMessagesTable } from '@/features/messages';
import {
  useInitProgram,
  useReadProgramMessage,
  useSendInjectedTransaction,
  useSendProgramMessage,
} from '@/features/programs/lib';

import { type FormattedPayloadValue, useSails } from '../../lib';
import { SailsActionGroup } from '../sails-action-group';

import styles from './sails-program-actions.module.scss';

const MESSAGES_TAB = 'Messages';
const IDL_TAB = 'IDL';
const INITIALIZE_TAB = 'Initialize';
const READ_TAB = 'Read';
const WRITE_TAB = 'Write';

const WRITE_MODE_STORAGE_KEY = 'sails-write-mode';
const WRITE_MODE_ONCHAIN = 'onchain';
const WRITE_MODE_OFFCHAIN = 'offchain';

type WriteMode = typeof WRITE_MODE_ONCHAIN | typeof WRITE_MODE_OFFCHAIN;

const TABS_LOADING = [MESSAGES_TAB];
const TABS_NO_IDL = [MESSAGES_TAB, IDL_TAB];
const TABS_WITH_INITIALIZE = [MESSAGES_TAB, INITIALIZE_TAB];
const TABS_WITH_IDL = [MESSAGES_TAB, READ_TAB, WRITE_TAB];

const getTabs = (isLoading: boolean, idl: string | null | undefined, isInitRequired: boolean) => {
  if (isLoading) return TABS_LOADING;
  if (!idl) return TABS_NO_IDL;
  if (isInitRequired) return TABS_WITH_INITIALIZE;
  return TABS_WITH_IDL;
};

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
  const [writeMode, setWriteMode] = useState<WriteMode>(() => {
    const mode = localStorage.getItem(WRITE_MODE_STORAGE_KEY);
    return mode === WRITE_MODE_OFFCHAIN ? WRITE_MODE_OFFCHAIN : WRITE_MODE_ONCHAIN;
  });
  const tabs = getTabs(isLoading, idl, init.isRequired);
  const activeTab = tabs[tabIndex] ?? MESSAGES_TAB;

  useEffect(() => {
    const maxTabIndex = tabs.length - 1;
    setTabIndex((currentTabIndex) => (currentTabIndex > maxTabIndex ? 0 : currentTabIndex));
  }, [tabs]);

  const sendInjectedTx = useSendInjectedTransaction(programId, sails);
  const sendMessage = useSendProgramMessage(programId, sails);
  const readMessage = useReadProgramMessage(programId, sails);

  const initProgram = useInitProgram(programId, sails);

  const isMessagesTab = activeTab === MESSAGES_TAB;
  const isInitializeTab = activeTab === INITIALIZE_TAB;
  const isReadTab = activeTab === READ_TAB;
  const isWriteTab = activeTab === WRITE_TAB;

  const setWriteModePreference = (mode: string) => {
    if (mode !== WRITE_MODE_ONCHAIN && mode !== WRITE_MODE_OFFCHAIN) return;

    setWriteMode(mode);
    localStorage.setItem(WRITE_MODE_STORAGE_KEY, mode);
  };

  const writeModeOptions = [
    {
      value: WRITE_MODE_ONCHAIN,
      label: 'Write onchain',
      description: 'Message is sent through Mirror contract on Ethereum.',
    },
    {
      value: WRITE_MODE_OFFCHAIN,
      label: 'Write offchain',
      description: 'Injected transaction is sent directly to Vara.Eth, bypassing Ethereum settlement.',
    },
  ] as const;

  const renderServiceActions = () =>
    Object.entries(sails!.services).map(([serviceName, service]) => {
      const queries = isReadTab
        ? Object.entries(service.queries).map(([messageName, meta]) => ({
            id: `query:${serviceName}:${messageName}`,
            name: messageName,
            action: 'Read',
            args: meta.args,
            encode: meta.encodePayload,
            requiresAccount: false,
            onSubmit: (payload: FormattedPayloadValue) =>
              readMessage.mutateAsync({ serviceName, messageName, payload }),
          }))
        : [];

      const functions = isWriteTab
        ? Object.entries(service.functions).map(([messageName, meta]) => ({
            id: `fn:${serviceName}:${messageName}`,
            name: messageName,
            action: writeMode === WRITE_MODE_OFFCHAIN ? 'Write offchain' : 'Write onchain',
            args: meta.args,
            encode: meta.encodePayload,
            splitAction: {
              selectedValue: writeMode,
              options: writeModeOptions,
              onOptionClick: setWriteModePreference,
            },
            onSubmit: (payload: FormattedPayloadValue) =>
              (writeMode === WRITE_MODE_OFFCHAIN ? sendInjectedTx : sendMessage).mutateAsync({
                serviceName,
                messageName,
                payload,
              }),
          }))
        : [];

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
    if (isMessagesTab) return <ProgramMessagesTable programId={programId} sails={sails} />;

    if (isLoading) return null;

    if (!idl)
      return (
        <div className={styles.emptyState}>
          <p>No IDL uploaded. Please upload an IDL file to initialize and interact with the program.</p>
          <UploadIdlButton onSaveIdl={onSaveIdl} />
        </div>
      );

    if (!sails) return null;
    if (isInitializeTab) return renderCtors();
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
