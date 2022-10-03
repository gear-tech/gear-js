/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { UserMessageSentData } from '@gear-js/api';
import { useState } from 'react';
import { generatePath, Link } from 'react-router-dom';
import clsx from 'clsx';

import { ReactComponent as ArrowSVG } from 'shared/assets/images/actions/arrowRight.svg';
import { IdeaEvent, Method } from 'entities/explorer';
import { PreformattedBlock } from 'shared/ui/preformattedBlock';
import { absoluteRoutes } from 'shared/config';

import { Log } from '../log';
import styles from './Event.module.scss';

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

  const isLog = method === Method.UserMessageSent;

  const getContent = ({ id, data }: IdeaEvent = event) =>
    isLog ? <Log key={id} data={data as UserMessageSentData} /> : <PreformattedBlock key={id} text={data.toHuman()} />;

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
