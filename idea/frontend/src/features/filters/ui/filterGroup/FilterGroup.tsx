import { ReactNode, useMemo, useRef } from 'react';
import { useForm, useFormState } from 'react-final-form';
import { CSSTransition } from 'react-transition-group';
import isEqual from 'lodash.isequal';
import { Button } from '@gear-js/ui';

import { AnimationTimeout } from '@/shared/config';

import styles from './FilterGroup.module.scss';

type Props = {
  name: string;
  title?: string;
  children: ReactNode;
  withReset?: boolean;
};

const FilterGroup = ({ name, title, withReset = false, children }: Props) => {
  const { change, submit } = useForm();
  const { values } = useFormState();

  const value = values[name];
  const defaultValue = useRef(value);

  const handleFilterReset = () => {
    change(name, defaultValue.current);
    submit();
  };

  const isResetVisible = useMemo(() => {
    if (!withReset) {
      return false;
    }

    return !isEqual(value, defaultValue.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, withReset]);

  return (
    <div className={styles.filterGroup}>
      {title && (
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <CSSTransition in={isResetVisible} timeout={AnimationTimeout.Default} mountOnEnter unmountOnExit>
            <Button text="Clear" color="transparent" className={styles.clearBtn} onClick={handleFilterReset} />
          </CSSTransition>
        </div>
      )}
      {children}
    </div>
  );
};

export { FilterGroup };
