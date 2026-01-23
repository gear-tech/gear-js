import { generatePath } from 'react-router-dom';
import { formatEther } from 'viem';

import { Balance, ChainEntity, HashLink } from '@/components';
import { routes } from '@/shared/config';

import { MessageRequest, MessageSent, ReplyRequest, ReplySent } from '../../lib';

const MessageRequestData = (props: MessageRequest) => {
  const { sourceAddress, programId, value, callReply, txHash, blockNumber, createdAt } = props;

  return (
    <ChainEntity.Data>
      <ChainEntity.Key>Source Address</ChainEntity.Key>
      <HashLink hash={sourceAddress} explorerLinkPath="address" />

      <ChainEntity.Key>Program ID</ChainEntity.Key>
      <HashLink hash={programId} href={generatePath(routes.program, { programId })} explorerLinkPath="address" />

      <ChainEntity.Key>Value</ChainEntity.Key>
      <Balance value={formatEther(BigInt(value))} units="ETH" />

      <ChainEntity.Key>Call Reply</ChainEntity.Key>
      <div>{String(callReply)}</div>

      <ChainEntity.Key>Transaction Hash</ChainEntity.Key>
      <HashLink hash={txHash} truncateSize="xxl" explorerLinkPath="tx" />

      <ChainEntity.Key>Block Number</ChainEntity.Key>
      <ChainEntity.Block number={blockNumber} date={createdAt} />
    </ChainEntity.Data>
  );
};

const MessageSentData = ({ sourceProgramId, destination, value, isCall, stateTransition, createdAt }: MessageSent) => {
  return (
    <ChainEntity.Data>
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
      <div>{new Date(createdAt).toLocaleString()}</div>
    </ChainEntity.Data>
  );
};

const ReplyRequestData = ({ sourceAddress, programId, value, txHash, blockNumber, createdAt }: ReplyRequest) => {
  return (
    <ChainEntity.Data>
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
      <HashLink hash={txHash} truncateSize="xxl" explorerLinkPath="tx" />

      <ChainEntity.Key>Block Number</ChainEntity.Key>
      <ChainEntity.Block number={blockNumber} date={createdAt} />
    </ChainEntity.Data>
  );
};

const ReplySentData = (props: ReplySent) => {
  const { repliedToId, replyCode, sourceProgramId, destination, value, isCall, stateTransition, createdAt } = props;

  return (
    <ChainEntity.Data>
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
      <div>{new Date(createdAt).toLocaleString()}</div>
    </ChainEntity.Data>
  );
};

const MessageData = {
  Request: MessageRequestData,
  Sent: MessageSentData,
  ReplyRequest: ReplyRequestData,
  ReplySent: ReplySentData,
};

export { MessageData };
