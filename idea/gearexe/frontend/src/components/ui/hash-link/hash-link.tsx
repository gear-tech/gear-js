import { Link } from 'react-router-dom';
import { CopyButton } from '../copy-button';
import styles from './hash-link.module.scss';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  hash: string;
  isExternalLink?: boolean;
  to?: string;
};

const HashLink = ({ isExternalLink, hash, to, ...restProps }: Props) => {
  return (
    <div className={styles.container}>
      {to ? (
        <Link to={to} className={styles.link} {...restProps}>
          {hash}
        </Link>
      ) : (
        <a target={'_blank'} rel={'noreferrer'} className={styles.link} {...restProps}>
          {hash}
        </a>
      )}

      <CopyButton value={hash}></CopyButton>
    </div>
  );
};

export { HashLink };
