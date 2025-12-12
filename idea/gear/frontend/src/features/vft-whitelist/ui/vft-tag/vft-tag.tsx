import { cx } from '@/shared/helpers';

import styles from './vft-tag.module.scss';

type Props = {
  size?: 'medium' | 'small';
};

function VftTag({ size = 'small' }: Props) {
  return <span className={cx(styles.tag, styles[size])}>VFT</span>;
}

export { VftTag };
