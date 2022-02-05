import React from 'react';
import { Vec } from '@polkadot/types';
import { AnyJson, AnyTuple } from '@polkadot/types/types';
import { FunctionArgumentMetadataV14 } from '@polkadot/types/interfaces';
import { Pre } from './Pre/Pre';
import styles from './Body.module.scss';

type Props = {
  args: AnyTuple;
  metaArgs: Vec<FunctionArgumentMetadataV14>;
};

const Body = ({ args, metaArgs }: Props) => {
  const data = metaArgs.reduce((dataObject: { [name: string]: AnyJson }, metaArg, index) => {
    const { name } = metaArg;
    const formattedName = name.toHuman();
    const formattedValue = args[index].toHuman();

    dataObject[formattedName] = formattedValue;

    return dataObject;
  }, {});

  return (
    <div className={styles.body}>
      <Pre text={data} />
    </div>
  );
};

export { Body };
