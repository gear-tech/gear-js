import { Hex } from '@gear-js/api';
import { Card } from '../card';
import styles from './Addresses.module.scss';

type Props = {
  list: Hex[];
};

function Addresses({ list }: Props) {
  const getAddresses = () =>
    list.map((address) => (
      <li key={address} className={styles.address}>
        {address}
      </li>
    ));

  return (
    <Card heading="Approved addresses">
      <ul className={styles.list}>{getAddresses()}</ul>
    </Card>
  );
}

export { Addresses };
