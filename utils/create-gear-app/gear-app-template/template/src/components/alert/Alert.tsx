import { Button } from '@gear-js/ui';
import clsx from 'clsx';
import xSVG from 'assets/images/alert/x.svg';
import styles from './Alert.module.scss';

type Props = {
  alert: any; // TODO: AlertTemplateProps from context
  close: () => void;
};

function Alert({ alert, close }: Props) {
  const { content, options } = alert;
  const { type, title, style, isClosed } = options;
  const headerClassName = clsx(styles.header, styles[type]);

  return (
    <div className={styles.alert} style={style}>
      <header className={headerClassName}>
        {title || type}
        {isClosed && <Button icon={xSVG} color="transparent" className={styles.button} onClick={close} />}
      </header>
      <div className={styles.body}>{content}</div>
    </div>
  );
}

export { Alert };
