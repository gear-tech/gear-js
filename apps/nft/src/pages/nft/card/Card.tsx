import clsx from 'clsx';
import { ReactNode } from 'react';
import styles from './Card.module.scss';

type BaseProps = {
  heading: string;
  text?: string;
  children?: ReactNode;
};

type TextProps = BaseProps & { text: string };
type ChildrenProps = BaseProps & { children: ReactNode };
type Props = TextProps | ChildrenProps;

function Card({ heading, text, children }: Props) {
  const wordsAmount = text?.split(' ').length || 0;
  const textClassName = clsx(styles.text, wordsAmount < 5 && styles.bold);

  return (
    <div className={styles.card}>
      <h3 className={styles.heading}>{heading}</h3>
      {text ? <p className={textClassName}>{text}</p> : children}
    </div>
  );
}

export { Card };
