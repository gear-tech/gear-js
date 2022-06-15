import { Card } from '../card';

type Props = {
  attributes: { [key: string]: string };
};

function Attributes({ attributes }: Props) {
  const getAttributes = () =>
    Object.keys(attributes).map((attribute) => (
      <li key={attribute}>
        {attribute}: {attributes[attribute]}
      </li>
    ));

  return (
    <Card heading="Attributes">
      <ul>{getAttributes()}</ul>
    </Card>
  );
}

export { Attributes };
