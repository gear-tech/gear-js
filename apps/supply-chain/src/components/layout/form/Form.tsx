import { Button } from '@gear-js/ui';
import { ReactNode } from 'react';
import styles from './Form.module.scss';

type Props = {
  heading: string;
  children: ReactNode;
  onSubmit: () => void;
};

function Form({ heading, children, onSubmit }: Props) {
  return (
    <div>
      <h3 className={styles.heading}>{heading}</h3>
      <form className={styles.form} onSubmit={onSubmit}>
        {children}
        <Button type="submit" text="Submit action" className={styles.button} />
      </form>
    </div>
  );
}

export { Form };
