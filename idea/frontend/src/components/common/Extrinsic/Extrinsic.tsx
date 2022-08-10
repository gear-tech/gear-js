import { Extrinsic as DotExtrinsic } from '@polkadot/types/interfaces';
import { AnyJson } from '@polkadot/types/types';

import { Pre } from '../Pre/Pre';
import { ExpansionPanel } from '../ExpansionPanel';

type Props = {
  extrinsic: DotExtrinsic;
  className?: string;
};

const Extrinsic = ({ extrinsic, className }: Props) => {
  const { method, section, meta, args } = extrinsic.method;
  const { docs, args: metaArgs } = meta;

  const caption = `${section}.${method}`;
  const description = docs[0].toHuman();

  const data = metaArgs.reduce((dataObject: { [name: string]: AnyJson }, metaArg, index) => {
    const { name } = metaArg;
    const formattedName = name.toHuman();
    const formattedValue = args[index].toHuman();

    // eslint-disable-next-line no-param-reassign
    dataObject[formattedName] = formattedValue;

    return dataObject;
  }, {});

  return (
    <ExpansionPanel caption={caption} description={String(description)} className={className}>
      <Pre text={data} />
    </ExpansionPanel>
  );
};

export { Extrinsic };
