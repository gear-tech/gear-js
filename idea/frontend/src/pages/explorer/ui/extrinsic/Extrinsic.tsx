import { Extrinsic as DotExtrinsic } from '@polkadot/types/interfaces';
import { AnyJson } from '@polkadot/types/types';

import { PreformattedBlock } from 'shared/ui/preformattedBlock';
import { ExpansionPanel } from '../expansionPanel';

type Props = {
  extrinsic: DotExtrinsic;
};

const Extrinsic = ({ extrinsic }: Props) => {
  const { method, section, meta, args } = extrinsic.method;
  const { docs, args: metaArgs } = meta;

  const heading = `${section}.${method}`;
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
    <ExpansionPanel heading={heading} subheading={description}>
      <PreformattedBlock text={data} />
    </ExpansionPanel>
  );
};

export { Extrinsic };
