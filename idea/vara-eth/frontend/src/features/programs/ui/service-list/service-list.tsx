import { HexString } from '@vara-eth/api';
import { useState } from 'react';

import { Badge, ExpandableItem, Tabs } from '@/components';

import { useReadContractState, useSails } from '../../lib';
import { InitForm } from '../init-form';
import { MessageForm } from '../message-form';

import styles from './service-list.module.scss';

const tabs = ['Call offchain', 'Call onchain'];

type Props = {
  programId: HexString;
  idl: string;
};

const ServiceList = ({ programId, idl }: Props) => {
  const { data: programState, refetch, isPending } = useReadContractState(programId);
  const { data: sails } = useSails(idl);
  const [tabIndex, setTabIndex] = useState(0);

  const isInitialized = programState && 'Active' in programState.program && programState.program.Active.initialized;

  if (!sails) return null;

  if (isPending) {
    return (
      <Badge color="secondary" className={styles.badge}>
        Loading...
      </Badge>
    );
  }

  const ctors = Object.entries(sails.ctors);

  const services = Object.entries(sails.services);

  const getFunctionsTitle = (count: number) => (count === 1 ? 'Function' : 'Functions');

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

          {services.map(([serviceName, service]) => {
            const functions = Object.entries(service.functions);
            const queries = Object.entries(service.queries);
            const messages = [...queries, ...functions];

            return (
              <ExpandableItem
                key={serviceName}
                header={serviceName}
                isOpen={services.length === 1}
                headerSlot={
                  <Badge color="secondary" className={styles.badge}>
                    {messages.length} {getFunctionsTitle(messages.length)}
                  </Badge>
                }>
                {messages.map(([messageName, { args }], index) => {
                  const isQuery = index < queries.length;

                  return (
                    <MessageForm
                      key={messageName}
                      serviceName={serviceName}
                      messageName={messageName}
                      programId={programId}
                      sails={sails}
                      args={args}
                      isQuery={isQuery}
                      idl={idl}
                      isOffchain={tabIndex === 0}
                    />
                  );
                })}
              </ExpandableItem>
            );
          })}
        </>
      ) : (
        <ExpandableItem
          header="Constructor"
          isOpen
          headerSlot={
            <Badge color="secondary" className={styles.badge}>
              {ctors.length} {getFunctionsTitle(ctors.length)}
            </Badge>
          }>
          {ctors.map(([ctorName, { args }]) => (
            <InitForm
              key={ctorName}
              programId={programId}
              sails={sails}
              ctorName={ctorName}
              args={args}
              onInit={refetch}
              idl={idl}
            />
          ))}
        </ExpandableItem>
      )}
    </div>
  );
};

export { ServiceList };
