import { Hex } from '@gear-js/api';
import Card from '../card';

type Props = {
  description: string;
  royalty?: number;
  owner: Hex;
};

function Summary({ description, royalty, owner }: Props) {
  const royaltyText = `${royalty}%`;

  return (
    <div>
      {/* <Card heading="Current price" text="100 Gear" /> */}
      <Card heading="Description" text={description} />
      {royalty && <Card heading="Royalty" text={royaltyText} />}
      <Card heading="Owner" text={owner} />
    </div>
  );
}

export default Summary;
