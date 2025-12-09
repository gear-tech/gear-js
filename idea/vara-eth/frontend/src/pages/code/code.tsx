import { HexString } from '@vara-eth/api';
import { useNavigate, useParams } from 'react-router-dom';

import ArrowLeftSVG from '@/assets/icons/arrow-square-left.svg?react';
import { Badge, Button, HashLink, Navigation, NotFound } from '@/components';
import { useGetCodeByIdQuery } from '@/features/codes/lib/queries';
import { CodeViewer } from '@/features/codes/ui/code-viewer';
import { CreateProgramButton } from '@/features/programs';
import { Search } from '@/features/search';
import { routes } from '@/shared/config';
import { formatDate } from '@/shared/utils';

import styles from './code.module.scss';

type Params = {
  codeId: HexString;
};

const Code = () => {
  const navigate = useNavigate();
  const params = useParams<Params>();
  const codeId = params?.codeId;

  const { data: code, isLoading } = useGetCodeByIdQuery(codeId || '');

  if (isLoading) {
    return (
      <>
        <Navigation search={<Search />} />
        <div className={styles.container}>
          <div className={styles.card}>
            <div>Loading...</div>
          </div>
        </div>
      </>
    );
  }

  if (!code || !codeId) {
    return (
      <>
        <Navigation search={<Search />} />
        <NotFound entity="code" id={codeId} />
      </>
    );
  }

  const blockHash = '0xQqC17F958D2ee523a2206206994597C13D831ec7';
  const blockDateTime = formatDate(Date.now());

  return (
    <>
      <Navigation search={<Search />} action={<CreateProgramButton codeId={codeId} />} />
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.leftSide}>
              <Button variant="icon" onClick={() => navigate(routes.programs)}>
                <ArrowLeftSVG className={styles.arrowLeft} />
              </Button>
              <HashLink hash={codeId} truncateSize="xxl" />
            </div>
            {/* TODO: add after code verifier is implemented */}
            {/* {isVerify && (
              <Tooltip value="Verified">
                <VerifySvg />
              </Tooltip>
            )} */}
          </div>

          <div className={styles.properties}>
            <div>SERVICES</div>
            <div className={styles.services}>
              <Badge color={1} size="sm">
                SERVICE 1
              </Badge>
              <Badge color={2} size="sm">
                SERVICE 2
              </Badge>
            </div>

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
    </>
  );
};

export { Code };
