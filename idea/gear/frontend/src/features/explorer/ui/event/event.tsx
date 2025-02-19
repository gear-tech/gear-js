/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import clsx from 'clsx';
import { useState } from 'react';
import { generatePath, Link } from 'react-router-dom';

import ArrowSVG from '@/shared/assets/images/actions/arrowRight.svg?react';
import { absoluteRoutes } from '@/shared/config';
import { PreformattedBlock } from '@/shared/ui/preformattedBlock';

import { Method } from '../../consts';
import { IdeaEvent } from '../../idea-event';
import { FormattedUserMessageSentData } from '../../types';
import { DecodedLogBlock } from '../decoded-log-block';

import styles from './event.module.scss';

type Props = {
  value: IdeaEvent | IdeaEvent[];
};

// TODO: use ExpansionPanel?

const Event = ({ value }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((prevValue) => !prevValue);

  const arrowClassName = clsx(styles.arrow, isOpen && styles.open);

  const isGroup = Array.isArray(value);

  const event = isGroup ? value[0] : value;
  const { method, heading, description, blockNumber } = event;

  const counter = isGroup ? value.length : undefined;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison -- TODO(#1800): resolve eslint comments
  const isLog = method === Method.UserMessageSent;

  const getContent = ({ id, data }: IdeaEvent = event) => {
    const formattedData = data.toHuman();

    return isLog ? (
      <DecodedLogBlock key={id} data={formattedData as FormattedUserMessageSentData} />
    ) : (
      <PreformattedBlock key={id} text={formattedData} />
    );
  };

  const getBody = () => (isGroup ? value.map(getContent) : getContent());

  const blockId = blockNumber?.split(',').join('');

  return (
    <div className={styles.event}>
      <header className={styles.header}>
        <div className={styles.main} onClick={toggle}>
          <div>
            <header className={styles.innerHeader}>
              <h3 className={styles.heading}>{heading}</h3>
              <ArrowSVG className={arrowClassName} />
            </header>

            <p className={styles.subheading}>{description}</p>
          </div>

          {counter && counter > 1 && <span className={styles.counter}>{`x${counter}`}</span>}
        </div>

        {blockId && (
          <Link to={generatePath(absoluteRoutes.block, { blockId })} className={styles.blockNumber}>
            {blockNumber}
          </Link>
        )}
      </header>

      {isOpen && <div className={styles.body}>{getBody()}</div>}
    </div>
  );
};

export { Event };
