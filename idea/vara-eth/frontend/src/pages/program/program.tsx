import { HexString } from '@vara-eth/api';
import { useNavigate, useParams } from 'react-router-dom';

import { useApproveWrappedVara, useWrappedVaraBalance } from '@/app/api';
import ArrowLeftSVG from '@/assets/icons/arrow-square-left.svg?react';
import EtherscanSvg from '@/assets/icons/etherscan.svg?react';
import VerifySvg from '@/assets/icons/verify.svg?react';
import { Badge, Balance, Button, HashLink, Navigation, NotFound, Tooltip } from '@/components';
import { ServiceList, useExecutableBalanceTopUp } from '@/features/programs';
import { useReadContractState, useGetProgramByIdQuery } from '@/features/programs/lib';
import { Search } from '@/features/search';
import { routes } from '@/shared/config';
import { formatBalance, formatNumber } from '@/shared/utils';

import styles from './program.module.scss';

type Params = {
  programId: HexString;
};

const Program = () => {
  const navigate = useNavigate();
  const { programId } = useParams() as Params;
  const approveWrappedVara = useApproveWrappedVara(programId);
  const executableBalanceTopUp = useExecutableBalanceTopUp(programId);

  const { data: program, isLoading } = useGetProgramByIdQuery(programId || '');
  const { data: programState, refetch } = useReadContractState(programId);

  const { decimals } = useWrappedVaraBalance(programId);
  const isActive = true;
  const programName = 'Program name';
  const codeId = program?.codeId || '';
  const blockHash = program?.createdAtTx || '';
  const blockDateTime = program?.createdAtBlock ? `Block ${program.createdAtBlock}` : '';

  const executableBalance =
    programState && decimals ? formatBalance(BigInt(programState.executableBalance), decimals) : null;

  const onTopUp = async () => {
    const topUpValue = BigInt(10 * 1e12);
    await approveWrappedVara.mutateAsync(topUpValue);
    await executableBalanceTopUp.mutateAsync(topUpValue);
    // TODO: updated after couple of seconds after the transaction
    await refetch();
  };

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

  if (!program || !programId) {
    return (
      <>
        <Navigation search={<Search />} />
        <NotFound entity="program" id={programId} />
      </>
    );
  }

  return (
    <>
      <Navigation search={<Search />} />
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
                  href={`https://hoodi.etherscan.io/address/${programId}`}
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
              <Balance value={formatNumber(programState?.balance || 0, 4)} units="ETH" />
            </div>
            <div>EXECUTABLE BALANCE</div>
            <div className={styles.property}>
              <Balance value={executableBalance} units="WVARA" />
              <Button
                size="xs"
                onClick={onTopUp}
                isLoading={executableBalanceTopUp.isPending || approveWrappedVara.isPending}
                variant="outline">
                Top up
              </Button>
            </div>
            <div>BLOCK HASH</div>
            <div className={styles.blockHash}>
              <HashLink hash={blockHash} />
              {blockDateTime}
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <ServiceList programId={programId} />
        </div>
      </div>
    </>
  );
};

export { Program };
