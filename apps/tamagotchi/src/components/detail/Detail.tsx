import clsx from 'clsx';
import { ReactNode } from 'react';
import styles from './Detail.module.scss';

type BaseProps = {
  label: string;
  direction?: 'x' | 'y';
  children?: ReactNode;
  text?: string;
  className?: string;
};

type ChildrenProps = BaseProps & { children: ReactNode; text?: never };
type TextProps = BaseProps & { text: string; children?: never };

type Props = ChildrenProps | TextProps;

function Detail({ label, className, children, text, direction = 'y' }: Props) {
  const detailClassName = clsx(styles.detail, className, styles[direction]);
  const labelClassName = clsx(styles.label, styles[direction]);

  return (
    <div className={detailClassName}>
      <span className={labelClassName}>{label}:</span>
      {children || <span>{text}</span>}
    </div>
  );
}

export { Detail };
