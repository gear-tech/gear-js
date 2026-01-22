import { ISailsFuncArg } from '@gear-js/sails-payload-form';
import { HexString } from '@vara-eth/api';
import { Sails } from 'sails-js';

import { SailsFunction, SailsService } from '../sails-service';

import styles from './sails-list.module.scss';

type Props = {
  value: {
    name: string;
    counter: number;
    list: { name: string; action: string; args: ISailsFuncArg[]; onSubmit: (payload: HexString) => Promise<unknown> }[];
  }[];
  sails: Sails;
};

function SailsList({ value, sails }: Props) {
  const renderList = (list: (typeof value)[number]['list']) =>
    list.map(({ name, action, args, onSubmit }) => (
      <SailsFunction key={name} name={name} action={action} sails={sails} args={args} onSubmit={onSubmit} />
    ));

  const render = () =>
    value.map(({ name, counter, list }) => (
      <SailsService key={name} name={name} counter={counter}>
        {renderList(list)}
      </SailsService>
    ));

  return <div className={styles.container}>{render()}</div>;
}

export { SailsList };
