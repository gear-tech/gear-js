import styles from './InfoText.module.scss';

type Props = {
  text: string;
};

function InfoText({ text }: Props) {
  return <p className={styles.text}>{text}</p>;
}

export { InfoText };
