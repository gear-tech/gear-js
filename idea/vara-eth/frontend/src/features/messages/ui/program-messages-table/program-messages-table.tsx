import { clsx } from 'clsx';
import { useMemo, useState } from 'react';
import { generatePath, Link } from 'react-router-dom';
import type { Sails } from 'sails-js';
import type { Hex } from 'viem';

import { HashLink, Pagination, Table } from '@/components';
import type { TableColumn } from '@/components/ui/table/table';
import { routes } from '@/shared/config';
import { formatDate } from '@/shared/utils';

import { getMessageName, useGetAllMessageRequestsQuery, useGetAllMessageSentsQuery } from '../../lib';

import styles from './program-messages-table.module.scss';

const FILTERS = ['Incoming', 'Outgoing'] as const;

type BaseRow = {
  id: Hex;
  messageId: Hex;
  messageLabel: string | undefined;
  createdAt: string;
};

type IncomingRow = BaseRow & { source: Hex };

type OutgoingRow = BaseRow & { destination: Hex };

const INCOMING_COLUMNS: readonly TableColumn<IncomingRow>[] = [
  {
    key: 'messageId',
    title: 'MESSAGE',
    skeletonWidth: 'sm',
    render: (messageId: string | undefined, { messageLabel }: IncomingRow) =>
      messageId && messageLabel ? (
        <Link
          to={generatePath(routes.message, { messageId })}
          className={styles.messageName}
          title={`${messageLabel} (${messageId})`}>
          {messageLabel}
        </Link>
      ) : messageId ? (
        <HashLink hash={messageId} truncateSize="sm" maxLength={8} href={generatePath(routes.message, { messageId })} />
      ) : (
        '-'
      ),
  },
  {
    key: 'source',
    title: 'SOURCE',
    skeletonWidth: 'sm',
    render: (source: string | undefined) =>
      source ? <HashLink hash={source} truncateSize="sm" maxLength={8} explorerLinkPath="address" /> : '-',
  },
  { key: 'createdAt', title: 'CREATED AT', sortable: true },
];

const OUTGOING_COLUMNS: readonly TableColumn<OutgoingRow>[] = [
  {
    key: 'messageId',
    title: 'MESSAGE ID',
    render: (messageId: string | undefined, { messageLabel }: OutgoingRow) =>
      messageId && messageLabel ? (
        <Link
          to={generatePath(routes.message, { messageId })}
          className={styles.messageName}
          title={`${messageLabel} (${messageId})`}>
          {messageLabel}
        </Link>
      ) : messageId ? (
        <HashLink hash={messageId} truncateSize="sm" maxLength={8} href={generatePath(routes.message, { messageId })} />
      ) : (
        '-'
      ),
    skeletonWidth: 'sm',
  },
  {
    key: 'destination',
    title: 'DESTINATION',
    render: (destination: string | undefined) =>
      destination ? <HashLink hash={destination} truncateSize="sm" maxLength={8} explorerLinkPath="address" /> : '-',
    skeletonWidth: 'sm',
  },
  { key: 'createdAt', title: 'CREATED AT', sortable: true },
];

type Props = {
  programId: Hex;
  sails?: Sails;
  pageSize?: number;
};

const ProgramMessagesTable = ({ programId, sails, pageSize = 5 }: Props) => {
  const [filterIndex, setFilterIndex] = useState(0);
  const [incomingPage, setIncomingPage] = useState(1);
  const [outgoingPage, setOutgoingPage] = useState(1);

  const isIncoming = filterIndex === 0;

  const incoming = useGetAllMessageRequestsQuery(incomingPage, pageSize, programId, { enabled: isIncoming });
  const outgoing = useGetAllMessageSentsQuery(outgoingPage, pageSize, programId, { enabled: !isIncoming });

  const incomingData = useMemo(
    () =>
      incoming.data?.data.map((item) => ({
        id: item.id,
        messageId: item.id,
        messageLabel: getMessageName(item.payload, sails) ?? undefined,
        source: item.sourceAddress,
        createdAt: formatDate(item.createdAt),
      })),
    [incoming.data, sails],
  );

  const outgoingData = useMemo(
    () =>
      outgoing.data?.data.map((item) => ({
        id: item.id,
        messageId: item.id,
        messageLabel: getMessageName(item.payload, sails) ?? undefined,
        destination: item.destination,
        createdAt: formatDate(item.createdAt),
      })),
    [outgoing.data, sails],
  );

  const currentPage = isIncoming ? incomingPage : outgoingPage;
  const totalItems = isIncoming ? (incoming.data?.total ?? 0) : (outgoing.data?.total ?? 0);
  const totalPages = totalItems ? Math.ceil(totalItems / pageSize) : 1;
  const isFetching = isIncoming ? incoming.isFetching : outgoing.isFetching;

  const setPage = isIncoming ? setIncomingPage : setOutgoingPage;

  return (
    <div>
      <div className={styles.filter}>
        <div className={styles.filterButtons}>
          {FILTERS.map((label, i) => (
            <button
              key={label}
              type="button"
              className={clsx(styles.filterButton, i === filterIndex && styles.filterButtonActive)}
              onClick={() => setFilterIndex(i)}>
              {label}
            </button>
          ))}
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} isFetching={isFetching} />
      </div>

      {isIncoming ? (
        <Table
          columns={INCOMING_COLUMNS}
          data={incomingData}
          isLoading={incoming.isFetching}
          pageSize={pageSize}
          positionedAt="bottom"
        />
      ) : (
        <Table
          columns={OUTGOING_COLUMNS}
          data={outgoingData}
          isLoading={outgoing.isFetching}
          pageSize={pageSize}
          positionedAt="bottom"
        />
      )}
    </div>
  );
};

export { ProgramMessagesTable };
