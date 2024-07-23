import cx from 'clsx';
import { ReactNode, useState } from 'react';
import { Sails } from 'sails-js';

import { getPreformattedText } from '@/shared/helpers';
import { PreformattedBlock } from '@/shared/ui';

import ArrowSVG from '../../assets/arrow.svg?react';
import { ISailsFuncArg, SailsService } from '../../types';
import styles from './sails-preview.module.scss';

type ISailsCtorFuncParams = Sails['ctors'][string];
type SailsServiceFunc = SailsService['functions'][string];
type SailsServiceQuery = SailsService['queries'][string];
type SailsServiceEvent = SailsService['events'][string];

type Props = {
  value: Sails;
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
  const { scaleCodecTypes, ctors, services } = value;

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
        <Accordion heading="Functions">
          <PreformattedBlock text={getFunctions(functions, getServiceFunction)} />
        </Accordion>

        <Accordion heading="Queries">
          <PreformattedBlock text={getFunctions(queries, getServiceFunction)} />
        </Accordion>

        <Accordion heading="Events">
          <PreformattedBlock text={getFunctions(events, getEventFunction)} />
        </Accordion>
      </Accordion>
    ));

  return (
    <div>
      <PreformattedBlock text="0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000" />

      <Accordion heading="Types">
        <PreformattedBlock text={getPreformattedText(scaleCodecTypes)} />
      </Accordion>

      <Accordion heading="Constructors">
        <PreformattedBlock text={getFunctions(ctors, getConstructorFunction)} />
      </Accordion>

      <Accordion heading={`Services (${serviceEntries.length})`}>{renderServices()}</Accordion>
    </div>
  );
}

export { SailsPreview };
