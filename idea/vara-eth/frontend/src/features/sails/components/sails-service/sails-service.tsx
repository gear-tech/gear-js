import { useState } from 'react';
import { Sails } from 'sails-js';

import ArrowSVG from '@/assets/icons/arrow-square-down.svg?react';
import { Badge } from '@/components';
import { cx } from '@/shared/utils';

import { SailsFunction } from './sails-function';
import styles from './sails-service.module.scss';

type Services = InstanceType<typeof Sails>['services'];
type SailsService = Services[string];

type Props = {
  name: string;
  value: SailsService;
  sails: Sails;
};

const SailsService = ({ name, value, sails }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const functions = Object.entries(value.functions);
  const queries = Object.entries(value.queries);
  const functionsAndQueries = [...queries, ...functions];

  const renderFunctions = () =>
    functionsAndQueries.map(([functionName, { args }], index) => (
      <SailsFunction
        key={functionName}
        name={functionName}
        type={index < queries.length ? 'query' : 'function'}
        sails={sails}
        args={args}
      />
    ));

  return (
    <div className={styles.container}>
      <button className={styles.header} onClick={() => setIsOpen((prevValue) => !prevValue)}>
        <ArrowSVG className={cx(styles.arrow, isOpen && styles.open)} />
        <span className={styles.title}>{name}</span>

        <Badge color="secondary">
          {functionsAndQueries.length} {functionsAndQueries.length === 1 ? 'Function' : 'Functions'}
        </Badge>
      </button>

      {isOpen && <div className={styles.body}>{renderFunctions()}</div>}
    </div>
  );
};

export { SailsService };
