import clsx from 'clsx';
import { Button } from '@gear-js/ui';
import xSVG from 'assets/images/alert/x.svg';
import styles from './Alert.module.scss';

type Props = {
  alert: any; // TODO: AlertTemplateProps from context
  close: () => void;
};

function Alert({ alert, close }: Props) {
  const { type, title, style, isClosed } = alert.options;

  const currentDate = new Date();

  return (
    <div className={styles.alert} style={style}>
      {isClosed && <Button icon={xSVG} color="transparent" className={styles.closeBtn} onClick={close} />}
      <header className={clsx(styles.header, styles[type || ''])}>{title || type}</header>
      <div className={styles.body}>{alert.content}</div>
      <footer className={styles.footer}>
        {currentDate.toLocaleDateString()} / {currentDate.toLocaleTimeString()}
      </footer>
    </div>
  );
}

export { Alert };
