import React from 'react';
import { Extrinsic as DotExtrinsic } from '@polkadot/types/interfaces';
import { AnyJson } from '@polkadot/types/types';
import { ExpansionPanel } from 'components/pages/Explorer/common/ExpansionPanel/ExpansionPanel';
import { Pre } from '../Pre/Pre';

type Props = {
  extrinsic: DotExtrinsic;
};

const Extrinsic = ({ extrinsic }: Props) => {
  const { method, section, meta, args } = extrinsic.method;
  const { docs, args: metaArgs } = meta;

  const caption = `${section}.${method}`;
  const description = docs[0].toHuman();

  const data = metaArgs.reduce((dataObject: { [name: string]: AnyJson }, metaArg, index) => {
    const { name } = metaArg;
    const formattedName = name.toHuman();
    const formattedValue = args[index].toHuman();

    dataObject[formattedName] = formattedValue;

    return dataObject;
  }, {});

  return (
    <ExpansionPanel caption={caption} description={String(description)}>
      <Pre text={data} />
    </ExpansionPanel>
  );
};

export { Extrinsic };
