import { HexString } from '@vara-eth/api';
import { MouseEvent, useState } from 'react';
import { Sails } from 'sails-js';

import ArrowSVG from '@/assets/icons/arrow-square-down.svg?react';
import { Button } from '@/components';
import { cx } from '@/shared/utils';

import { SailsAction as SailsActionType } from '../../lib';
import { SailsPayloadForm } from '../sails-payload-form';

import styles from './sails-action.module.scss';

const SailsAction = ({ id, name, action, sails, args, encode, onSubmit }: SailsActionType & { sails: Sails }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!isOpen) {
      // prevent submit, somehow react updates state before event is finished,
      // therefore using type={isOpen ? 'button' : 'submit'} not works
      event.preventDefault();
      setIsOpen(true);
    }
  };

  const handleSubmit = async (payload: HexString) => {
    setIsSubmitting(true);

    return onSubmit(payload).finally(() => setIsSubmitting(false));
  };

  return (
    // TODO: ExpandableItem component? it's not truly flexible though
    <div className={styles.container}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <header className={styles.header} onClick={() => setIsOpen((prevValue) => !prevValue)}>
        <ArrowSVG className={cx(styles.arrow, isOpen && styles.open)} />
        <span className={styles.title}>{name}</span>

        <Button type="submit" variant="default" size="xs" isLoading={isSubmitting} form={id} onClick={handleClick}>
          {action}
        </Button>
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
