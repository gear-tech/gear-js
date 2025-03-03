import { Link } from 'react-router-dom';

import { CopyButton } from '../copy-button';

import styles from './hash-link.module.scss';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  hash: string;
  isExternalLink?: boolean;
};

const HashLink = ({ isExternalLink, hash, href, ...restProps }: Props) => {
  return (
    <div className={styles.container}>
      {!isExternalLink && href ? (
        <Link to={href} className={styles.link} {...restProps}>
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
