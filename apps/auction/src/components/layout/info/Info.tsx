import styles from './Info.module.scss';

type Props = {
  text: string;
};

function Info({ text }: Props) {
  return (
    <div className={styles.info}>
      <p>{text}</p>
    </div>
  );
}

export { Info };
