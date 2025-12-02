import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

import { useMediaQuery } from '@/shared/hooks';
import { getTruncatedText } from '@/shared/utils';

import { CopyButton } from '../copy-button';

import styles from './hash-link.module.scss';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  hash: string;
  isExternalLink?: boolean;
  isDisabled?: boolean;
};

const HashLink = ({ isExternalLink, hash, href, isDisabled, ...restProps }: Props) => {
  const className = clsx(styles.link, isDisabled && styles.disabled);
  const shouldTruncateHash = useMediaQuery('(max-width: 1200px)');

  const displayHash = shouldTruncateHash ? getTruncatedText(hash) : hash;

  return (
    <div className={styles.container}>
      {!isExternalLink && href ? (
        <Link to={href} className={className} {...restProps}>
          {displayHash}
        </Link>
      ) : (
        <a target={'_blank'} rel={'noreferrer'} className={className} {...restProps}>
          {displayHash}
        </a>
      )}

      <CopyButton value={hash}></CopyButton>
    </div>
  );
};

export { HashLink };
