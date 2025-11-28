import { HexString } from '@gear-js/api';
import { Sails } from 'sails-js';

import { VftAccountOverview } from './vft-account-overview';
import { VftEvents } from './vft-events';
import { VftOverview } from './vft-overview';
import { VftRoles } from './vft-roles';
import styles from './vft.module.scss';

type Props = {
  id: HexString | undefined;
  sails: Sails | undefined;
};

function Vft({ id, sails }: Props) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <VftOverview id={id} />
        <VftAccountOverview id={id} />
      </header>

      <VftRoles id={id} />
      <VftEvents id={id} sails={sails} />
    </div>
  );
}

export { Vft };
