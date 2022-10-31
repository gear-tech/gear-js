import { memo } from 'react';
import { generatePath } from 'react-router-dom';

import { absoluteRoutes, routes } from 'shared/config';
import { IdBlock } from 'shared/ui/idBlock';
import { ActionLink } from 'shared/ui/ActionLink';
import { TimestampBlock } from 'shared/ui/timestampBlock';
import initializeProgramSVG from 'shared/assets/images/actions/initializeProgram.svg';
import relatedProgramsSVG from 'shared/assets/images/actions/relatedPrograms.svg';

import styles from './HorizontalCodeCard.module.scss';
import { ICode } from '../../model';

type Props = {
  code: ICode;
};

const HorizontalCodeCard = memo(({ code }: Props) => {
  const { id: codeId, timestamp } = code;

  return (
    <article className={styles.horizontalCodeCard}>
      <div className={styles.content}>
        <IdBlock id={codeId} size="large" className={styles.codeId} />
        {timestamp && (
          <div className={styles.otherInfo}>
            <TimestampBlock color="light" withIcon timestamp={timestamp} />
          </div>
        )}
      </div>
      <div className={styles.actions}>
        {/* TODO: rename initialize to create */}
        <ActionLink
          to={generatePath(absoluteRoutes.initializeProgram, { codeId })}
          icon={initializeProgramSVG}
          text="Create program"
          className={styles.sendMessage}
        />
        <ActionLink to={routes.programs} icon={relatedProgramsSVG} text="Related programs" state={{ query: codeId }} />
      </div>
    </article>
  );
});

export { HorizontalCodeCard };
