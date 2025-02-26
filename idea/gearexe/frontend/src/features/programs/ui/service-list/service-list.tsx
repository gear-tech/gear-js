import { HexString } from 'gearexe';

import { useReadContractState } from '@/app/api';
import { Badge, Button, Input, ExpandableItem } from '@/components';

import counterIdl from '../../../../../../../../apis/gearexe/programs/counter-idl/counter.idl?raw';
import { useInitProgram } from '../../lib/use-init-program';
import { useSails } from '../../lib/use-sails';
import { MessageForm } from '../message-form';

import styles from './service-list.module.scss';

type Props = {
  programId: HexString;
};

const ServiceList = ({ programId }: Props) => {
  const { data: programState, isPending: isReadPending } = useReadContractState(programId);

  const { initProgram, isPending: isInitPending } = useInitProgram(programId);

  const isPending = isInitPending || isReadPending;
  const { data: sails } = useSails(counterIdl);

  const isInitialized = programState && 'Active' in programState.program && programState.program.Active.initialized;

  if (!sails) return null;

  const ctors = Object.entries(sails.ctors);

  const services = Object.entries(sails.services);

  const getFunctionsTitle = (count: number) => (count === 1 ? 'Function' : 'Functions');
  const isDisabled = isPending;

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
                {messages.map(([messageName, { args, encodePayload }], index) => {
                  const isQuery = index < queries.length;

                  return (
                    <MessageForm
                      key={serviceName}
                      serviceName={serviceName}
                      messageName={messageName}
                      programId={programId}
                      sails={sails}
                      args={args}
                      isQuery={isQuery}
                      encodePayload={encodePayload}
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
          headerSlot={
            <Badge color="secondary" className={styles.badge}>
              {ctors.length} {getFunctionsTitle(ctors.length)}
            </Badge>
          }>
          {ctors.map(([ctorName, { args }]) => (
            <ExpandableItem
              key={ctorName}
              header={ctorName}
              isNested
              headerSlot={
                <Button variant="default" size="xs" disabled={isDisabled} onClick={() => initProgram(ctorName)}>
                  Initialize
                </Button>
              }>
              {args.map((param) => (
                // TODO: add form
                <Input key={param.name} name={param.name} placeholder="0x" />
              ))}
            </ExpandableItem>
          ))}
        </ExpandableItem>
      )}
    </div>
  );
};

export { ServiceList };
