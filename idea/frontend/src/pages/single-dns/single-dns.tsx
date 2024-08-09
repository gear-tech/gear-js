import { useParams } from 'react-router-dom';

import styles from './single-dns.module.scss';

type Params = {
  name: string;
};

function SingleDns() {
  const params = useParams() as Params;

  console.log('params: ', params);

  return null;
}

export { SingleDns };
