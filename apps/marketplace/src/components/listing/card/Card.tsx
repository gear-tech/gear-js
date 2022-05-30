import clsx from 'clsx';
import { ReactNode } from 'react';
import styles from './Card.module.scss';

type Props = {
  heading: string;
  text?: string;
  children?: ReactNode;
};

function Card({ heading, text, children }: Props) {
  const isDescription = heading === 'Description';
  const isOwner = heading === 'Owner';

  const className = clsx(isDescription ? styles.description : styles.text, isOwner && styles.owner);

  return (
    <div className={styles.card}>
      <h3 className={styles.heading}>{heading}</h3>
      {children || (text && <p className={className}>{text}</p>)}
    </div>
  );
}

export default Card;
