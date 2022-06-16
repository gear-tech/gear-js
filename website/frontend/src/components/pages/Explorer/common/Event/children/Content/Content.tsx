import { GenericEventData } from '@polkadot/types';
import { Pre } from '../../../Pre/Pre';

type Props = {
  data: GenericEventData;
};

const Content = ({ data }: Props) => <Pre text={data.toHuman()} />;

export { Content };
