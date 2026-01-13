import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

import { getTruncatedText } from '@/shared/utils';

import { CopyButton } from '../copy-button';
import { MediaQuery, BreakpointSize } from '../media-query';

import styles from './hash-link.module.scss';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  hash: string;
  isExternalLink?: boolean;
  isDisabled?: boolean;
  truncateSize?: BreakpointSize;
};

const HashLink = ({ isExternalLink, hash, href, isDisabled, truncateSize = 'xl', ...restProps }: Props) => {
  const className = clsx(styles.link, isDisabled && styles.disabled);

  const MediaQuerySize = MediaQuery[truncateSize];
  const displayHash = <MediaQuerySize above={hash} below={getTruncatedText(hash)} />;

  return (
    <span className={styles.container}>
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
    </span>
  );
};

export { HashLink };
