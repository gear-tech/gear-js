import { HexString } from 'gearexe';

import { useReadContractState } from '@/app/api';
import { Badge, ExpandableItem } from '@/components';

import counterIdl from '../../../../../../../../apis/gearexe/programs/counter-idl/counter.idl?raw';
import { useSails } from '../../lib/use-sails';
import { InitForm } from '../init-form';
import { MessageForm } from '../message-form';

import styles from './service-list.module.scss';

type Props = {
  programId: HexString;
};

const ServiceList = ({ programId }: Props) => {
  const { data: programState, refetch, isPending } = useReadContractState(programId);
  const { data: sails } = useSails(counterIdl);

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
          {services.map(([serviceName, service]) => {
            const functions = Object.entries(service.functions);
            const queries = Object.entries(service.queries);
            const messages = [...queries, ...functions];

            return (
              <ExpandableItem
                key={serviceName}
                header={serviceName}
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
            />
          ))}
        </ExpandableItem>
      )}
    </div>
  );
};

export { ServiceList };
