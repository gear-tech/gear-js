import { useNavigate, useParams } from 'react-router-dom';

import ArrowLeftSVG from '@/assets/icons/arrow-square-left.svg?react';
import EtherscanSvg from '@/assets/icons/etherscan.svg?react';
import VerifySvg from '@/assets/icons/verify.svg?react';
import { Badge, Balance, Button, HashLink, Tooltip } from '@/components';
import { ServiceList } from '@/features/programs/ui/service-list';
import { routes } from '@/shared/config';
import { formatDate, formatNumber } from '@/shared/utils';

import styles from './program.module.scss';

type Params = {
  programId: string;
};

const Program = () => {
  const navigate = useNavigate();
  const { programId } = useParams() as Params;

  const isActive = true;
  const programName = 'Program name';
  const codeId = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
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
            <HashLink hash={programId} />
            <Tooltip value="View on Etherscan">
              {/* TODO: support mainnet */}
              <a
                href={`https://holesky.etherscan.io/address/${programId}`}
                target={'_blank'}
                rel={'noreferrer'}
                className={styles.link}>
                <EtherscanSvg />
              </a>
            </Tooltip>
          </div>
          {isActive && <Badge>Active</Badge>}
        </div>

        {programName && <div className={styles.name}>{programName}</div>}

        <div className={styles.properties}>
          <div className={styles.property}>
            CODE ID
            <Tooltip value="Verified">
              <VerifySvg />
            </Tooltip>
          </div>
          <HashLink hash={codeId} />
          <div>PROGRAM BALANCE</div>
          <div>
            <Balance value={formatNumber(3020.449, 4)} units="WVARA" withDivider />
            <Balance value={formatNumber(20, 4)} units="ETH" />
          </div>
          <div>EXECUTABLE BALANCE</div>
          <Balance value={formatNumber(3020.449, 4)} units="WVARA" />
          <div>BLOCK HASH</div>
          <div className={styles.blockHash}>
            <HashLink hash={blockHash} />
            {blockDateTime}
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <ServiceList />
      </div>
    </div>
  );
};

export { Program };
