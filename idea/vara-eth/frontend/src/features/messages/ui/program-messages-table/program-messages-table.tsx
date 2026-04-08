import { clsx } from 'clsx';
import { useMemo, useState } from 'react';
import { generatePath } from 'react-router-dom';
import type { Hex } from 'viem';

import { HashLink, Pagination, Table } from '@/components';
import { routes } from '@/shared/config';
import { formatDate } from '@/shared/utils';

import { useGetAllMessageRequestsQuery, useGetAllMessageSentsQuery } from '../../lib';

import styles from './program-messages-table.module.scss';

const FILTERS = ['Incoming', 'Outgoing'] as const;

const INCOMING_COLUMNS = [
  {
    key: 'messageId' as const,
    title: 'MESSAGE ID',
    skeletonWidth: 'sm',
    render: (messageId: string) => (
      <HashLink hash={messageId} truncateSize="sm" maxLength={8} href={generatePath(routes.message, { messageId })} />
    ),
  },
  {
    key: 'source' as const,
    title: 'SOURCE',
    skeletonWidth: 'sm',
    render: (source: string) => <HashLink hash={source} truncateSize="sm" maxLength={8} explorerLinkPath="address" />,
  },
  { key: 'createdAt' as const, title: 'CREATED AT', sortable: true },
] as const;

const OUTGOING_COLUMNS = [
  {
    key: 'messageId' as const,
    title: 'MESSAGE ID',
    render: (messageId: string) => (
      <HashLink hash={messageId} truncateSize="sm" maxLength={8} href={generatePath(routes.message, { messageId })} />
    ),
    skeletonWidth: 'sm',
  },
  {
    key: 'destination' as const,
    title: 'DESTINATION',
    render: (destination: string) => (
      <HashLink hash={destination} truncateSize="sm" maxLength={8} explorerLinkPath="address" />
    ),
    skeletonWidth: 'sm',
  },
  { key: 'createdAt' as const, title: 'CREATED AT', sortable: true },
] as const;

type Props = {
  programId: Hex;
  pageSize?: number;
};

const ProgramMessagesTable = ({ programId, pageSize = 5 }: Props) => {
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
        source: item.sourceAddress,
        createdAt: formatDate(item.createdAt),
      })),
    [incoming.data],
  );

  const outgoingData = useMemo(
    () =>
      outgoing.data?.data.map((item) => ({
        id: item.id,
        messageId: item.id,
        destination: item.destination,
        createdAt: formatDate(item.createdAt),
      })),
    [outgoing.data],
  );

  const currentPage = isIncoming ? incomingPage : outgoingPage;
  const totalItems = isIncoming ? (incoming.data?.total ?? 0) : (outgoing.data?.total ?? 0);
  const totalPages = totalItems ? Math.ceil(totalItems / pageSize) : 1;

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

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {isIncoming ? (
        <Table
          columns={INCOMING_COLUMNS}
          data={incomingData}
          isLoading={incoming.isFetching}
          lineHeight="md"
          pageSize={pageSize}
          positionedAt="bottom"
        />
      ) : (
        <Table
          columns={OUTGOING_COLUMNS}
          data={outgoingData}
          isLoading={outgoing.isFetching}
          lineHeight="md"
          pageSize={pageSize}
          positionedAt="bottom"
        />
      )}
    </div>
  );
};

export { ProgramMessagesTable };
