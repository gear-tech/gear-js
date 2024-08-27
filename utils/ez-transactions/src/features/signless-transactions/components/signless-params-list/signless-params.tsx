import styles from './signless-params.module.css';

type Props = {
  params: {
    heading: string;
    value: JSX.Element | string | number;
  }[];
};

function SignlessParams({ params }: Props) {
  return (
    <ul className={styles.summary}>
      {params.map((param) => (
        <li className={styles.summaryItem} key={param.heading}>
          <h4 className={styles.heading}>{param.heading}</h4>
          <div className={styles.separator} />
          <p className={styles.value}>{param.value}</p>
        </li>
      ))}
    </ul>
  );
}

export { SignlessParams };
