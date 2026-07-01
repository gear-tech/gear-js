import type { ISailsFuncArg } from '@gear-js/sails-payload-form';
import cx from 'clsx';
import { type ReactNode, useMemo, useState } from 'react';
import type { SailsProgram } from 'sails-js';
import type { IServiceExpo } from 'sails-js/types';

import { getPreformattedText, isAnyKey } from '@/shared/helpers';
import { PreformattedBlock } from '@/shared/ui';

import ArrowSVG from '../../assets/arrow.svg?react';
import type {
  ISailsCtorFuncParams,
  ParsedSails,
  SailsService,
  SailsServiceEvent,
  SailsServiceFunc,
  SailsServiceQuery,
} from '../../types';
import { formatTypeForSignature, formatTypesMap, isIdlV2Program } from '../../utils/format-preview-types';

import styles from './sails-preview.module.scss';

type SailsV2Service = SailsProgram['services'][string];

type Props = {
  value: ParsedSails;
};

function Accordion({ heading, children }: { heading: ReactNode; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggle = () => setIsOpen((prevValue) => !prevValue);

  return (
    <div className={styles.accordion}>
      <button type="button" onClick={toggle} className={cx(styles.button, isOpen && styles.open)}>
        <ArrowSVG />
        <span>{heading}</span>
      </button>

      {isOpen && children}
    </div>
  );
}

function SailsPreview({ value }: Props) {
  const { ctors, services } = value;
  const isV2 = isIdlV2Program(value);

  const programTypes = isV2 ? formatTypesMap(value.programTypes) : value.scaleCodecTypes;
  const hasProgramTypes = isV2 ? value.programTypes.size > 0 : isAnyKey(programTypes);

  const interfaceIds = useMemo(() => {
    if (!isIdlV2Program(value)) return new Map<string, string>();
    const serviceExpos: IServiceExpo[] = value.program?.services ?? [];
    return new Map(
      serviceExpos
        .filter((service) => service.interface_id)
        .map((service) => [service.name, String(service.interface_id)]),
    );
  }, [value]);

  const getArgs = (args: ISailsFuncArg[]) => args.map(({ name, type }) => `${name}: ${type}`).join(', ');

  const getFunction = (name: string, returnType?: string, args?: ISailsFuncArg[]) =>
    `${name}: (${args ? getArgs(args) : ''}) => ${returnType}`;

  const getConstructorFunction = (name: string, { args }: ISailsCtorFuncParams) => getFunction(name, 'void', args);

  const getServiceFunction = (name: string, { args, returnType }: SailsServiceFunc | SailsServiceQuery) =>
    getFunction(name, formatTypeForSignature(returnType), args);

  const getEventFunction = (name: string, { type }: SailsServiceEvent) =>
    getFunction(name, formatTypeForSignature(type));

  const getFunctions = <T,>(funcs: Record<string, T>, getFunc: (name: string, func: T) => string) =>
    Object.entries(funcs)
      .map(([name, func]) => getFunc(name, func))
      .join('\n');

  const serviceEntries = Object.entries(services);

  const formatServiceLabel = (name: string) => {
    const interfaceId = interfaceIds.get(name);

    return interfaceId ? `${name}@${interfaceId}` : name;
  };

  const getServiceHeading = (name: string) => {
    const interfaceId = interfaceIds.get(name);

    if (!interfaceId) return name;

    return (
      <>
        {name}
        <span className={styles.interfaceId}>@{interfaceId}</span>
      </>
    );
  };

  const renderServiceSections = (service: SailsService) => {
    const { functions, queries, events } = service;
    const v2Service = isV2 ? (service as SailsV2Service) : null;

    return (
      <>
        {v2Service && isAnyKey(v2Service.extends) && (
          <Accordion heading="Extends">
            <PreformattedBlock text={Object.keys(v2Service.extends).map(formatServiceLabel).join('\n')} />
          </Accordion>
        )}

        {v2Service?.types && v2Service.types.size > 0 && (
          <Accordion heading="Types">
            <PreformattedBlock text={getPreformattedText(formatTypesMap(v2Service.types))} />
          </Accordion>
        )}

        {isAnyKey(functions) && (
          <Accordion heading="Functions">
            <PreformattedBlock text={getFunctions(functions, getServiceFunction)} />
          </Accordion>
        )}

        {isAnyKey(queries) && (
          <Accordion heading="Queries">
            <PreformattedBlock text={getFunctions(queries, getServiceFunction)} />
          </Accordion>
        )}

        {isAnyKey(events) && (
          <Accordion heading="Events">
            <PreformattedBlock text={getFunctions(events, getEventFunction)} />
          </Accordion>
        )}
      </>
    );
  };

  const renderServices = () =>
    serviceEntries.map(([name, service]) => (
      <Accordion key={name} heading={getServiceHeading(name)}>
        {renderServiceSections(service)}
      </Accordion>
    ));

  return (
    <div>
      {hasProgramTypes && (
        <Accordion heading="Types">
          <PreformattedBlock text={getPreformattedText(programTypes)} />
        </Accordion>
      )}

      {ctors && (
        <Accordion heading="Constructors">
          <PreformattedBlock text={getFunctions(ctors, getConstructorFunction)} />
        </Accordion>
      )}

      <Accordion heading={`Services (${serviceEntries.length})`}>{renderServices()}</Accordion>
    </div>
  );
}

export { SailsPreview };
