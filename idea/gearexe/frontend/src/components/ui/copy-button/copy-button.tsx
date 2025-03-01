import clsx from 'clsx';
import { useState } from 'react';

import Copy from '@/assets/icons/document-copy.svg?react';
import { Button } from '@/components';
import { copyToClipboard } from '@/shared/utils';

import { ButtonProps } from '../button/button';

import styles from './copy-button.module.scss';

type Props = Omit<ButtonProps, 'children'> & {
  value: string;
};

const CopyButton = ({ value, className, ...restProps }: Props) => {
  const [showTip, setShowTip] = useState(false);
  const onCopy = () => {
    copyToClipboard({
      value,
      onSuccess: () => {
        setShowTip(true);
        setTimeout(() => {
          setShowTip(false);
        }, 800);
      },
    });
  };

  return (
    <Button variant="icon" onClick={onCopy} className={clsx(styles.button, className)} {...restProps}>
      <Copy />
      {showTip && <div className={styles.tooltip}>Copied</div>}
    </Button>
  );
};

export { CopyButton };
