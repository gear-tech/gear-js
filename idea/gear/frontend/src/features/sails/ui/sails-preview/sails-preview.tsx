import type { ISailsFuncArg } from '@gear-js/sails-payload-form';
import cx from 'clsx';
import { type ReactNode, useState } from 'react';

import { getPreformattedText, isAnyKey } from '@/shared/helpers';
import { PreformattedBlock } from '@/shared/ui';

import ArrowSVG from '../../assets/arrow.svg?react';
import type {
  ISailsCtorFuncParams,
  ParsedSails,
  SailsServiceEvent,
  SailsServiceFunc,
  SailsServiceQuery,
} from '../../types';

import styles from './sails-preview.module.scss';

type Props = {
  value: ParsedSails;
};

function Accordion({ heading, children }: { heading: string; children: ReactNode }) {
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
  const typesObject = 'programTypes' in value ? Object.fromEntries(value.programTypes) : value.scaleCodecTypes;

  const getArgs = (args: ISailsFuncArg[]) => args.map(({ name, type }) => `${name}: ${type}`).join(', ');
  const getReturnType = (type: unknown) => JSON.stringify(type).replace(/"/g, '');

  const getFunction = (name: string, returnType?: string, args?: ISailsFuncArg[]) =>
    `${name}: (${args ? getArgs(args) : ''}) => ${returnType}`;

  const getConstructorFunction = (name: string, { args }: ISailsCtorFuncParams) => getFunction(name, 'void', args);

  const getServiceFunction = (name: string, { args, returnType }: SailsServiceFunc | SailsServiceQuery) =>
    getFunction(name, getReturnType(returnType), args);

  const getEventFunction = (name: string, { type }: SailsServiceEvent) => getFunction(name, getReturnType(type));

  const getFunctions = <T,>(funcs: Record<string, T>, getFunc: (name: string, func: T) => string) =>
    Object.entries(funcs)
      .map(([name, func]) => getFunc(name, func))
      .join('\n');

  const serviceEntries = Object.entries(services);

  const renderServices = () =>
    serviceEntries.map(([name, { functions, queries, events }]) => (
      <Accordion key={name} heading={name}>
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
      </Accordion>
    ));

  return (
    <div>
      <Accordion heading="Types">
        <PreformattedBlock text={getPreformattedText(typesObject)} />
      </Accordion>

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
