import { MouseEvent, useState } from 'react';
import { Sails } from 'sails-js';

import ArrowSVG from '@/assets/icons/arrow-square-down.svg?react';
import { Button } from '@/components';
import { cx } from '@/shared/utils';

import { FormattedPayloadValue, SailsAction as SailsActionType } from '../../lib';
import { SailsPayloadForm } from '../sails-payload-form';

import styles from './sails-action.module.scss';

type Props = SailsActionType & {
  sails: Sails;
};

const SailsAction = ({ id, name, action, sails, args, encode, onSubmit }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEmpty = args.length === 0;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!isOpen) {
      // prevent submit, somehow react updates state before event is finished,
      // therefore using type={isOpen ? 'button' : 'submit'} not works
      event.preventDefault();
      setIsOpen(true);
    }
  };

  const handleSubmit = async (payload: FormattedPayloadValue) => {
    setIsSubmitting(true);

    return onSubmit(payload).finally(() => setIsSubmitting(false));
  };

  const buttonProps = {
    type: 'submit' as const,
    variant: 'default' as const,
    size: 'xs' as const,
    isLoading: isSubmitting,
    form: id,
    children: action,
  };

  // TODO: ExpandableItem component? it's not flexible though
  if (isEmpty)
    return (
      <div className={styles.container}>
        <header className={cx(styles.header, styles.empty)}>
          <ArrowSVG className={styles.arrow} />
          <span className={styles.title}>{name}</span>
          <Button {...buttonProps} />
        </header>

        <SailsPayloadForm id={id} sails={sails} args={args} encode={encode} onSubmit={handleSubmit} />
      </div>
    );

  return (
    <div className={styles.container}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <header className={cx(styles.header, isOpen && styles.open)} onClick={() => setIsOpen((prevValue) => !prevValue)}>
        <ArrowSVG className={styles.arrow} />
        <span className={styles.title}>{name}</span>
        <Button {...buttonProps} onClick={handleClick} />
      </header>

      {isOpen && (
        <div className={styles.body}>
          <SailsPayloadForm id={id} sails={sails} args={args} encode={encode} onSubmit={handleSubmit} />
        </div>
      )}
    </div>
  );
};

export { SailsAction };
