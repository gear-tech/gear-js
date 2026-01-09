import { HexString } from '@vara-eth/api';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { useApproveWrappedVara, useWrappedVaraBalance } from '@/app/api';
import { useVaraEthApi } from '@/app/providers';
import ArrowLeftSVG from '@/assets/icons/arrow-square-left.svg?react';
import EtherscanSvg from '@/assets/icons/etherscan.svg?react';
import { Badge, Balance, Button, HashLink, UploadIdlButton, Navigation, NotFound, Tooltip } from '@/components';
import { ServiceList, useExecutableBalanceTopUp } from '@/features/programs';
import { useReadContractState, useGetProgramByIdQuery } from '@/features/programs/lib';
import { Search } from '@/features/search';
import { routes } from '@/shared/config';
import { useIdlStorage } from '@/shared/hooks';
import { formatBalance, formatDate, formatNumber } from '@/shared/utils';

import styles from './program.module.scss';

type Params = {
  programId: HexString;
};

const Program = () => {
  const navigate = useNavigate();
  const params = useParams<Params>();
  const programId = params.programId!;
  const approveWrappedVara = useApproveWrappedVara(programId);
  const executableBalanceTopUp = useExecutableBalanceTopUp(programId);
  const { isApiReady } = useVaraEthApi();

  const { data: program, isLoading, error } = useGetProgramByIdQuery(programId);
  const { data: programState, refetch, isLoading: isProgramStateLoading } = useReadContractState(programId);

  const { decimals } = useWrappedVaraBalance(programId);
  const isActive = programState && 'Active' in programState.program;
  const isInitialized = isActive && programState.program.Active.initialized;
  const programName = ''; // TODO: get program name when it's implemented
  const codeId = program?.code?.id;
  const blockHash = program?.txHash || '';
  const formattedCreatedAt = program?.createdAt ? formatDate(program.createdAt) : '';
  const { idl } = useIdlStorage(codeId);

  const executableBalance =
    programState && decimals ? formatBalance(BigInt(programState.executableBalance), decimals) : null;

  const onTopUp = async () => {
    const topUpValue = BigInt(10 * 1e12);
    await approveWrappedVara.mutateAsync(topUpValue);
    await executableBalanceTopUp.mutateAsync(topUpValue);
    // TODO: updated after couple of seconds after the transaction
    await refetch();
  };

  if (isLoading || isProgramStateLoading || !isApiReady) {
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

  if (error || !programState) {
    return (
      <>
        <Navigation search={<Search />} />
        <NotFound entity="program" id={programId} />
      </>
    );
  }

  const serviceListContent = () => {
    if (idl) return <ServiceList programId={programId} idl={idl} />;
    if (!codeId) return null;
    return (
      <div className={styles.emptyState}>
        <p>No IDL uploaded. Please upload an IDL file to initialize and interact with the program.</p>
        <UploadIdlButton id={codeId} />
      </div>
    );
  };

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
            {isActive && (isInitialized ? <Badge>Active</Badge> : <Badge color="secondary">Uninitialized</Badge>)}
          </div>

          {programName && <div className={styles.name}>{programName}</div>}

          <div className={styles.properties}>
            {codeId && (
              <>
                <div className={styles.property}>CODE ID</div>
                <HashLink hash={codeId} href={generatePath(routes.code, { codeId })} />
              </>
            )}
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
                variant="secondary">
                Top up
              </Button>
            </div>
            {blockHash && (
              <>
                <div>BLOCK HASH</div>
                <div className={styles.blockHash}>
                  <HashLink hash={blockHash} />
                  {formattedCreatedAt}
                </div>
              </>
            )}
          </div>
        </div>

        <div className={styles.card}>{serviceListContent()}</div>
      </div>
    </>
  );
};

export { Program };
