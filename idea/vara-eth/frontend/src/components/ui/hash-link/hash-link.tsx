import { clsx } from 'clsx';
import { ComponentProps } from 'react';
import { Link } from 'react-router-dom';

import { getTruncatedText } from '@/shared/utils';

import { CopyButton } from '../copy-button';
import { ExplorerLink } from '../explorer-link';
import { MediaQuery, BreakpointSize } from '../media-query';

import styles from './hash-link.module.scss';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  hash: string;
  isExternalLink?: boolean;
  isDisabled?: boolean;
  truncateSize?: BreakpointSize;
  explorerLinkPath?: ComponentProps<typeof ExplorerLink>['path'];
};

const HashLink = ({
  isExternalLink,
  hash,
  href,
  isDisabled,
  truncateSize = 'xl',
  explorerLinkPath,
  ...props
}: Props) => {
  const className = clsx(styles.link, isDisabled && styles.disabled);

  const MediaQuerySize = MediaQuery[truncateSize];
  const displayHash = <MediaQuerySize above={hash} below={getTruncatedText(hash)} />;

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
