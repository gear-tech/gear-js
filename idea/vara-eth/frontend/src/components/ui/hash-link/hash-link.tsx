import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

import { getTruncatedText } from '@/shared/utils';

import { CopyButton } from '../copy-button';
import { MediaQuery } from '../media-query';

import styles from './hash-link.module.scss';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  hash: string;
  isExternalLink?: boolean;
  isDisabled?: boolean;
};

const HashLink = ({ isExternalLink, hash, href, isDisabled, ...restProps }: Props) => {
  const className = clsx(styles.link, isDisabled && styles.disabled);

  const displayHash = (
    <>
      <MediaQuery.ShowFromXl>{hash}</MediaQuery.ShowFromXl>
      <MediaQuery.ShowBelowXl>{getTruncatedText(hash)}</MediaQuery.ShowBelowXl>
    </>
  );

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
