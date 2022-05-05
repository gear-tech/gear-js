import { Hex } from '@gear-js/api';
import Card from '../card';

type Props = {
  description: string;
  owner: Hex;
  price?: string | null;
  royalty?: number;
};

function Summary({ description, owner, price, royalty }: Props) {
  const royaltyText = `${royalty}%`;

  return (
    <div>
      {price && <Card heading="Current price" text={price} />}
      <Card heading="Description" text={description} />
      {royalty && <Card heading="Royalty" text={royaltyText} />}
      <Card heading="Owner" text={owner} />
    </div>
  );
}

export default Summary;
