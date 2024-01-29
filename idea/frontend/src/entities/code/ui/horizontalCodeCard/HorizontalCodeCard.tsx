import { memo } from 'react';
import { generatePath, Link } from 'react-router-dom';

import { absoluteRoutes, routes } from '@/shared/config';
import { IdBlock } from '@/shared/ui/idBlock';
import { ActionLink } from '@/shared/ui/ActionLink';
import { TimestampBlock } from '@/shared/ui/timestampBlock';
import CreateProgramSVG from '@/shared/assets/images/actions/create-program.svg?react';
import RelatedrelatedProgramsSVG from '@/shared/assets/images/actions/related-programs.svg?react';

import { ICode } from '../../model';
import styles from './HorizontalCodeCard.module.scss';

type Props = {
  code: ICode;
};

const HorizontalCodeCard = memo(({ code }: Props) => {
  const { id: codeId, timestamp, name } = code;

  const to = `/code/${codeId}`;

  return (
    <article className={styles.horizontalCodeCard}>
      <div className={styles.content}>
        <Link to={to} className={styles.name}>
          {name}
        </Link>
        {timestamp && (
          <div className={styles.otherInfo}>
            <IdBlock id={codeId} size="medium" withIcon color="light" />
            <TimestampBlock color="light" withIcon timestamp={timestamp} />
          </div>
        )}
      </div>
      <div className={styles.actions}>
        {/* TODO: rename initialize to create */}
        <ActionLink
          to={generatePath(absoluteRoutes.initializeProgram, { codeId })}
          icon={CreateProgramSVG}
          text="Create program"
        />

        <ActionLink
          to={routes.programs}
          icon={RelatedrelatedProgramsSVG}
          text="Related programs"
          state={{ query: codeId }}
        />
      </div>
    </article>
  );
});

export { HorizontalCodeCard };
