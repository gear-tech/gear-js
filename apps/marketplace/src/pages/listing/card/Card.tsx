import { ReactNode } from 'react';
import styles from './Card.module.scss';

type Props = {
  heading: string;
  text?: string;
  children?: ReactNode;
};

function Card({ heading, text, children }: Props) {
  const isDescription = heading === 'Description';

  return (
    <div className={styles.card}>
      <h3 className={styles.heading}>{heading}</h3>
      {children || (text && <p className={isDescription ? styles.description : styles.text}>{text}</p>)}
    </div>
  );
}

export default Card;
