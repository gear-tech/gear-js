import styles from './SelectText.module.scss';

type Props = {
  value: string;
};

function SelectText({ value }: Props) {
  return (
    <div className={styles.text}>
      <p className={styles.heading}>Select {value}</p>
      <p className={styles.subheading}>Select one of the {value}s in the list on the left to continue</p>
    </div>
  );
}

export { SelectText };
