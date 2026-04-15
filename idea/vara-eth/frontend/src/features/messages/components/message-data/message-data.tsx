import { Fragment } from 'react/jsx-runtime';
import { generatePath } from 'react-router-dom';
import { formatEther } from 'viem';

import { Balance, ChainEntity, HashLink, Skeleton } from '@/components';
import { routes } from '@/shared/config';

import type { MessageRequest, MessageSent, ReplyRequest, ReplySent, SailsMessageRoute } from '../../lib';

type RouteProp = {
  route?: SailsMessageRoute | null;
};

const SailsRouteData = ({ route }: { route: SailsMessageRoute }) => {
  const kindLabel = route.kind.toUpperCase();

  return (
    <>
      {route.kind !== 'constructor' && route.service && (
        <>
          <ChainEntity.Key>SERVICE</ChainEntity.Key>
          <div>{route.service}</div>
        </>
      )}

      <ChainEntity.Key>{kindLabel}</ChainEntity.Key>
      <div>{route.name}</div>
    </>
  );
};

const MessageRequestData = (props: MessageRequest & RouteProp) => {
  const { sourceAddress, programId, value, callReply, txHash, blockNumber, createdAt, route } = props;

  return (
    <ChainEntity.Data>
      {route && <SailsRouteData route={route} />}
      <ChainEntity.Key>Source Address</ChainEntity.Key>
      <HashLink hash={sourceAddress} explorerLinkPath="address" />

      <ChainEntity.Key>Program ID</ChainEntity.Key>
      <HashLink hash={programId} href={generatePath(routes.program, { programId })} explorerLinkPath="address" />

      <ChainEntity.Key>Value</ChainEntity.Key>
      <Balance value={formatEther(BigInt(value))} units="ETH" />

      <ChainEntity.Key>Call Reply</ChainEntity.Key>
      <div>{String(callReply)}</div>

      <ChainEntity.Key>Transaction Hash</ChainEntity.Key>
      <HashLink hash={txHash} truncateSize="xxl" maxLength={36} explorerLinkPath="tx" />

      <ChainEntity.Key>Block Number</ChainEntity.Key>
      <ChainEntity.BlockNumber value={blockNumber} date={createdAt} />
    </ChainEntity.Data>
  );
};

const MessageSentData = ({
  sourceProgramId,
  destination,
  value,
  isCall,
  stateTransition,
  createdAt,
  route,
}: MessageSent & RouteProp) => {
  return (
    <ChainEntity.Data>
      {route && <SailsRouteData route={route} />}
      <ChainEntity.Key>Source Program ID</ChainEntity.Key>

      <HashLink
        hash={sourceProgramId}
        href={generatePath(routes.program, { programId: sourceProgramId })}
        explorerLinkPath="address"
      />

      <ChainEntity.Key>Destination</ChainEntity.Key>
      <HashLink hash={destination} explorerLinkPath="address" />

      <ChainEntity.Key>Value</ChainEntity.Key>
      <Balance value={formatEther(BigInt(value))} units="ETH" />

      <ChainEntity.Key>Is Call</ChainEntity.Key>
      <div>{String(isCall)}</div>

      {stateTransition && (
        <>
          <ChainEntity.Key>State Transition Hash</ChainEntity.Key>
          <HashLink hash={stateTransition.hash} maxLength={36} truncateSize="xxl" />
        </>
      )}

      <ChainEntity.Key>Created At</ChainEntity.Key>
      <ChainEntity.Date value={createdAt} />
    </ChainEntity.Data>
  );
};

const ReplyRequestData = ({
  sourceAddress,
  programId,
  value,
  txHash,
  blockNumber,
  createdAt,
  route,
}: ReplyRequest & RouteProp) => {
  return (
    <ChainEntity.Data>
      {route && <SailsRouteData route={route} />}
      <ChainEntity.Key>Source Address</ChainEntity.Key>
      <HashLink hash={sourceAddress} explorerLinkPath="address" />

      <ChainEntity.Key>Program ID</ChainEntity.Key>

      <HashLink
        hash={programId}
        href={generatePath(routes.program, { programId: programId })}
        explorerLinkPath="address"
      />

      <ChainEntity.Key>Value</ChainEntity.Key>
      <Balance value={formatEther(BigInt(value))} units="ETH" />

      <ChainEntity.Key>Transaction Hash</ChainEntity.Key>
      <HashLink hash={txHash} maxLength={36} truncateSize="xxl" explorerLinkPath="tx" />

      <ChainEntity.Key>Block Number</ChainEntity.Key>
      <ChainEntity.BlockNumber value={blockNumber} date={createdAt} />
    </ChainEntity.Data>
  );
};

const ReplySentData = (props: ReplySent & RouteProp) => {
  const { repliedToId, replyCode, sourceProgramId, destination, value, isCall, stateTransition, createdAt, route } =
    props;

  return (
    <ChainEntity.Data>
      {route && <SailsRouteData route={route} />}
      <ChainEntity.Key>Replied To ID</ChainEntity.Key>
      <HashLink hash={repliedToId} truncateSize="xxl" />

      <ChainEntity.Key>Reply Code</ChainEntity.Key>
      <div>{replyCode}</div>

      <ChainEntity.Key>Source Program ID</ChainEntity.Key>

      <HashLink
        hash={sourceProgramId}
        href={generatePath(routes.program, { programId: sourceProgramId })}
        explorerLinkPath="address"
      />

      <ChainEntity.Key>Destination</ChainEntity.Key>
      <HashLink hash={destination} explorerLinkPath="address" />

      <ChainEntity.Key>Value</ChainEntity.Key>
      <Balance value={formatEther(BigInt(value))} units="ETH" />

      <ChainEntity.Key>Is Call</ChainEntity.Key>
      <div>{String(isCall)}</div>

      {stateTransition && (
        <>
          <ChainEntity.Key>State Transition Hash</ChainEntity.Key>
          <HashLink hash={stateTransition.hash} truncateSize="xxl" />
        </>
      )}

      <ChainEntity.Key>Created At</ChainEntity.Key>
      <ChainEntity.Date value={createdAt} />
    </ChainEntity.Data>
  );
};

const SkeletonData = () => {
  const render = () =>
    Array.from({ length: 6 }, (_, index) => (
      <Fragment key={index}>
        <ChainEntity.Key>
          <Skeleton width="8rem" />
        </ChainEntity.Key>

        <Skeleton width="16rem" />
      </Fragment>
    ));

  return <ChainEntity.Data>{render()}</ChainEntity.Data>;
};

const MessageData = {
  Request: MessageRequestData,
  Sent: MessageSentData,
  ReplyRequest: ReplyRequestData,
  ReplySent: ReplySentData,
  Skeleton: SkeletonData,
};

export { MessageData };
