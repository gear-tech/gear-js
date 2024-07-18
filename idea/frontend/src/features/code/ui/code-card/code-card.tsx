import { Link, generatePath } from 'react-router-dom';

import { absoluteRoutes, routes } from '@/shared/config';
import { IdBlock } from '@/shared/ui';
import { ActionLink } from '@/shared/ui/ActionLink';
import { TimestampBlock } from '@/shared/ui/timestampBlock';
import CreateProgramSVG from '@/shared/assets/images/actions/create-program.svg?react';
import RelatedrelatedProgramsSVG from '@/shared/assets/images/actions/related-programs.svg?react';

import { Code } from '../../api';
import styles from './code-card.module.scss';

type Props = {
  code: Code;
};

function CodeCard({ code }: Props) {
  const { id, timestamp, name } = code;

  const to = `/code/${id}`;

  return (
    <div className={styles.horizontalCodeCard}>
      <div className={styles.content}>
        <Link to={to} className={styles.name}>
          {name || 'Code'}
        </Link>

        {timestamp && (
          <div className={styles.otherInfo}>
            <IdBlock id={id} size="medium" withIcon color="light" />
            <TimestampBlock color="light" withIcon timestamp={timestamp} />
          </div>
        )}
      </div>
      <div className={styles.actions}>
        <ActionLink
          // TODO: rename initialize to create
          to={generatePath(absoluteRoutes.initializeProgram, { codeId: id })}
          icon={CreateProgramSVG}
          text="Create program"
        />

        <ActionLink
          to={routes.programs}
          icon={RelatedrelatedProgramsSVG}
          text="Related programs"
          state={{ codeId: id }}
        />
      </div>
    </div>
  );
}

export { CodeCard };
