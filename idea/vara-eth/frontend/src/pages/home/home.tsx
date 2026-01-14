import { Link } from 'react-router-dom';

import TransactionSVG from '@/assets/icons/arrange-square.svg?react';
import CodeSVG from '@/assets/icons/code.svg?react';
import MessageSVG from '@/assets/icons/message.svg?react';
import UserSVG from '@/assets/icons/user-square.svg?react';
import {
  useGetAllMessageRequestsQuery,
  useGetAllMessageSentsQuery,
  useGetAllReplyRequestsQuery,
  useGetAllReplySentsQuery,
} from '@/features/messages';
import { useGetAllProgramsQuery } from '@/features/programs';
import { useGetAllTransactionsQuery } from '@/features/transactions';
import { routes } from '@/shared/config';
import { formatNumber, isUndefined } from '@/shared/utils';

import styles from './home.module.scss';

const PROGRAMS_LINK = { text: 'View All', to: routes.programs };

type CardProps = {
  title: string;
  icon: React.ReactNode;
  count: number | undefined;
  increase: number;
  link?: { text: string; to: string };
};

const Card = ({ title, icon, link, count, increase }: CardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <span className={styles.cardTitle}>
          {icon}
          {title}
        </span>

        {link && (
          <Link className={styles.link} to={link.to}>
            [{link.text}]
          </Link>
        )}
      </div>

      <div className={styles.row}>
        {!isUndefined(count) && <span className={styles.cardCount}>{formatNumber(count)}</span>}

        {increase && (
          <span>
            <span className={styles.accent}>+ {formatNumber(increase)}</span> / last 24h
          </span>
        )}
      </div>
    </div>
  );
};

const Home = () => {
  const { data: programs } = useGetAllProgramsQuery(1, 1);
  const { data: messagesRequests } = useGetAllMessageRequestsQuery(1, 1);
  const { data: messagesSent } = useGetAllMessageSentsQuery(1, 1);
  const { data: replyRequests } = useGetAllReplyRequestsQuery(1, 1);
  const { data: replySents } = useGetAllReplySentsQuery(1, 1);
  const { data: transactions } = useGetAllTransactionsQuery(1, 1);

  const messagesCount =
    !isUndefined(messagesRequests?.total) &&
    !isUndefined(messagesSent?.total) &&
    !isUndefined(replyRequests?.total) &&
    !isUndefined(replySents?.total)
      ? messagesRequests.total + messagesSent.total + replyRequests.total + replySents.total
      : undefined;

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>
          Welcome to <span className={styles.accent}>Idea Vara.Eth</span>
        </h1>
      </div>

      <div className={styles.titleContainer}>
        <h2 className={styles.subtitle}>
          {'//_A portal for codes, programs, and events on Vara and Ethereum Networks, powered by Vara.eth'}
        </h2>
      </div>

      <Card title="Programs" icon={<CodeSVG />} link={PROGRAMS_LINK} count={programs?.total} increase={5000} />
      <Card title="Messages" icon={<MessageSVG />} count={messagesCount} increase={5000} />
      <Card title="Transactions" icon={<TransactionSVG />} count={transactions?.total} increase={5000} />
      <Card title="Users" icon={<UserSVG />} count={100000} increase={5000} />
    </div>
  );
};

export { Home };
