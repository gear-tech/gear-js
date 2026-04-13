import { clsx } from 'clsx';
import type { ComponentProps } from 'react';
import { Link } from 'react-router-dom';

import { getTruncatedText } from '@/shared/utils';

import { CopyButton } from '../copy-button';
import { ExplorerLink } from '../explorer-link';
import { type BreakpointSize, MediaQuery } from '../media-query';

import styles from './hash-link.module.scss';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  hash: string;
  isExternalLink?: boolean;
  isDisabled?: boolean;
  truncateSize?: BreakpointSize;
  explorerLinkPath?: ComponentProps<typeof ExplorerLink>['path'];
  maxLength?: number;
};

const HashLink = ({
  isExternalLink,
  hash,
  href,
  isDisabled,
  truncateSize = 'xl',
  explorerLinkPath,
  maxLength,
  ...props
}: Props) => {
  const className = clsx(styles.link, isDisabled && styles.disabled);

  const MediaQuerySize = MediaQuery[truncateSize];
  const defaultTruncatedHash = maxLength ? getTruncatedText(hash, maxLength / 2) : hash;
  const displayHash = <MediaQuerySize above={defaultTruncatedHash} below={getTruncatedText(hash)} />;

  return (
    <span className={styles.container}>
      {!isExternalLink && href ? (
        <Link to={href} className={className} {...props}>
          {displayHash}
        </Link>
      ) : (
        <a target="_blank" rel="noreferrer" className={className} {...props}>
          {displayHash}
        </a>
      )}

      <CopyButton value={hash} />

      {explorerLinkPath && <ExplorerLink id={hash} path={explorerLinkPath} className={styles.explorerLink} />}
    </span>
  );
};

export { HashLink };
