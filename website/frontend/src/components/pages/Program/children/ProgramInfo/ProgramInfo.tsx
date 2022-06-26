import clsx from 'clsx';
import { Link, generatePath } from 'react-router-dom';
import { Metadata } from '@gear-js/api';
import { buttonStyles } from '@gear-js/ui';

import styles from './ProgramInfo.module.scss';
import { MetaData } from './MetaData/MetaData';

import { routes } from 'routes';
import { formatDate } from 'helpers';
import { ProgramModel } from 'types/program';
import { formStyles, FormText } from 'components/common/Form';
import messageSVG from 'assets/images/message.svg';

type Props = {
  program: ProgramModel;
  metadata?: Metadata;
};

const ProgramInfo = ({ program, metadata }: Props) => {
  const { id: programId, title, name } = program;

  const isState = Boolean(metadata?.meta_state_output);

  const linkClasses = clsx(buttonStyles.button, buttonStyles.primary, buttonStyles.normal);

  return (
    <div className={formStyles.largeForm}>
      <FormText label="Id" text={programId} />

      <FormText label="Name" text={name || ''} />

      <FormText label="Title" text={title || '...'} />

      <div className={clsx(formStyles.field, formStyles.formItem)}>
        <span className={clsx(formStyles.fieldLabel, metadata && formStyles.topPadding)}>Metadata</span>
        <div className={formStyles.fieldContent}>
          {metadata ? <MetaData metadata={metadata} /> : <span className={styles.emptyMetadata}>No metadata</span>}
        </div>
      </div>

      <div className={formStyles.formButtons}>
        <Link to={generatePath(`${routes.send}/${routes.sendMessage}`, { programId })} className={linkClasses}>
          <img src={messageSVG} alt="message" className={buttonStyles.icon} />
          Send Message
        </Link>

        {isState && (
          <Link to={generatePath(routes.state, { programId })} className={linkClasses}>
            Read State
          </Link>
        )}

        <div className={styles.buttonUpload}>
          <span className={styles.buttonCaption}>Uploaded at:</span>
          <span className={styles.buttonTimestamp}>{formatDate(program.timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

export { ProgramInfo };
