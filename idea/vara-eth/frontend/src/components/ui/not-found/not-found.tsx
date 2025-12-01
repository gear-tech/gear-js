import { HashLink } from '../hash-link';

import styles from './not-found.module.scss';

type Props = {
  entity: string;
  id?: string;
};

const NotFound = ({ entity, id }: Props) => {
  const title = `${entity} not found`;

  return (
    <div className={styles.notFound}>
      <h2>{title}</h2>
      {id && (
        <p>
          The {entity} with ID <HashLink hash={id} /> does not exist.
        </p>
      )}
    </div>
  );
};

export { NotFound };
