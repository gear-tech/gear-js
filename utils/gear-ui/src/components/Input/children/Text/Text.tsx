import styles from './Text.module.scss';

type Props = {
  txt: string;
};

const Text = ({ txt }: Props) => <span className={styles.text}>{txt}</span>;

export { Text };
