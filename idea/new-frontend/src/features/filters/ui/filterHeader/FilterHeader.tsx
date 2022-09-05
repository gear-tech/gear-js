import { useRef, useMemo } from 'react';
import { useForm, useFormState } from 'react-final-form';
import { CSSTransition } from 'react-transition-group';
import isEqual from 'lodash.isequal';
import { Button } from '@gear-js/ui';

import { AnimationTimeout } from 'shared/config';

import styles from './FilterHeader.module.scss';

const FilterHeader = () => {
  const { reset } = useForm();
  const { values, initialValues } = useFormState();

  const defaultValues = useRef(initialValues);

  const handleClick = () => reset(defaultValues.current);

  const isDirty = useMemo(() => !isEqual(values, defaultValues.current), [values]);

  return (
    <div className={styles.header}>
      <h1 className={styles.title}>Filters</h1>
      <CSSTransition in={isDirty} timeout={AnimationTimeout.Default} mountOnEnter unmountOnExit>
        <Button text="Clear all" color="transparent" className={styles.clearAllBtn} onClick={handleClick} />
      </CSSTransition>
    </div>
  );
};

export { FilterHeader };
