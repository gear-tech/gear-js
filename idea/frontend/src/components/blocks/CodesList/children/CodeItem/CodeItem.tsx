import { memo } from 'react';
import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import styles from './CodeItem.module.scss';

import { copyToClipboard, fileNameHandler, formatDate } from 'helpers';
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

  return (
    <>
      <div className={styles.codeNameWrapper}>
        <span className={styles.codeName}>{fileNameHandler(name)}</span>
        <Tooltip content="Copy ID">
          <Button icon={copySVG} color="transparent" onClick={handleCopy} />
        </Tooltip>
        <Tooltip content="Initialize program">
          <Button icon={initProgramSVG} color="transparent" onClick={() => {}} />
        </Tooltip>
      </div>
      <span className={styles.codeHash}>{codeId}</span>
      <span className={styles.timestamp}>{formatDate(timestamp)}</span>
    </>
  );
});

export { CodeItem };
