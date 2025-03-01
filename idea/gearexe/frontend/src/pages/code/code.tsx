import { useNavigate, useParams } from 'react-router-dom';

import ArrowLeftSVG from '@/assets/icons/arrow-square-left.svg?react';
import VerifySvg from '@/assets/icons/verify.svg?react';
import { Button, HashLink, Tooltip } from '@/components';
import { CodeViewer } from '@/features/codes/ui/code-viewer';
import { routes } from '@/shared/config';
import { formatDate } from '@/shared/utils';

import styles from './code.module.scss';

type Params = {
  codeId: string;
};

const Code = () => {
  const navigate = useNavigate();
  const { codeId } = useParams() as Params;

  const isVerify = true;
  const blockHash = '0xQqC17F958D2ee523a2206206994597C13D831ec7';
  const blockDateTime = formatDate(Date.now());

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.leftSide}>
            <Button variant="icon" onClick={() => navigate(routes.programs)}>
              <ArrowLeftSVG className={styles.arrowLeft} />
            </Button>
            <HashLink hash={codeId} />
          </div>
          {isVerify && (
            <Tooltip value="Verified">
              <VerifySvg />
            </Tooltip>
          )}
        </div>

        <div className={styles.properties}>
          <div>SERVICES</div>
          <HashLink hash={codeId} />

          <div>PROGRAMS</div>
          {/* TODO: add filtered programs page */}
          <a className={styles.programs} href={routes.programs}>
            3 programs
          </a>

          <div>BLOCK HASH</div>

          <div className={styles.blockHash}>
            <HashLink hash={blockHash} />
            {blockDateTime}
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <CodeViewer />
      </div>
    </div>
  );
};

export { Code };
