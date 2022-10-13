import { memo } from 'react';
import { Link, generatePath } from 'react-router-dom';
import clsx from 'clsx';
import { useAlert } from '@gear-js/react-hooks';
import { Button, buttonStyles } from '@gear-js/ui';

import styles from './CodeItem.module.scss';

import { routes } from 'routes';
import { copyToClipboard, getShortName, formatDate } from 'helpers';
import { CodeModel } from 'types/code';
import { Tooltip } from 'components/common/Tooltip';
import copySVG from 'assets/images/copy.svg';
import initProgramSVG from 'assets/images/initProgram.svg';

type Props = {
  code: CodeModel;
};

const CodeItem = memo(({ code }: Props) => {
  const alert = useAlert();

  const { id: codeId, name, timestamp } = code;

  const handleCopy = () => copyToClipboard(codeId, alert, 'Code ID copied');

  const linkClasses = clsx(buttonStyles.button, buttonStyles.noText, buttonStyles.transparent);

  return (
    <>
      <div className={styles.codeNameWrapper}>
        <span className={styles.codeName}>{getShortName(name)}</span>
        <Tooltip content="Copy ID">
          <Button icon={copySVG} color="transparent" onClick={handleCopy} />
        </Tooltip>
        <Tooltip content="Create program">
          <Link to={generatePath(routes.code, { codeId })} className={linkClasses}>
            <img src={initProgramSVG} alt="create program" />
          </Link>
        </Tooltip>
      </div>
      <span className={styles.codeHash}>{codeId}</span>
      {timestamp && <span className={styles.timestamp}>{formatDate(timestamp)}</span>}
    </>
  );
});

export { CodeItem };
