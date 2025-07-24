import clsx from 'clsx';
import { Link } from 'react-router-dom';

import { CopyButton } from '../copy-button';

import styles from './hash-link.module.scss';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  hash: string;
  isExternalLink?: boolean;
  isDisabled?: boolean;
};

const HashLink = ({ isExternalLink, hash, href, isDisabled, ...restProps }: Props) => {
  const className = clsx(styles.link, isDisabled && styles.disabled);

  return (
    <div className={styles.container}>
      {!isExternalLink && href ? (
        <Link to={href} className={className} {...restProps}>
          {hash}
        </Link>
      ) : (
        <a target={'_blank'} rel={'noreferrer'} className={className} {...restProps}>
          {hash}
        </a>
      )}

      <CopyButton value={hash}></CopyButton>
    </div>
  );
};

export { HashLink };
