import { Link } from 'react-router-dom';

import TransactionSVG from '@/assets/icons/arrange-square.svg?react';
import CodeSVG from '@/assets/icons/code.svg?react';
import MessageSVG from '@/assets/icons/message.svg?react';
import { useGetAllCodesQuery } from '@/features/codes';
import {
  useGetAllMessageRequestsQuery,
  useGetAllMessageSentsQuery,
  useGetAllReplyRequestsQuery,
  useGetAllReplySentsQuery,
} from '@/features/messages';
import { useGetAllProgramsQuery } from '@/features/programs';
import { useGetAllTransactionsQuery } from '@/features/transactions';
import { routes } from '@/shared/config';
import { SVGComponent } from '@/shared/types';
import { formatNumber, isUndefined } from '@/shared/utils';

import styles from './home.module.scss';

type CardProps = {
  title: string;
  SVG: SVGComponent;
  count: number | undefined;
  linkTo?: string;
};

const Card = ({ title, SVG, linkTo, count }: CardProps) => {
  const Container = linkTo ? Link : 'div';

  return (
    <Container className={styles.card} to={linkTo!}>
      <header className={styles.cardHeader}>
        <span className={styles.cardTitle}>
          <SVG />
          {title}
        </span>

        {linkTo && <span className={styles.link}>[View All]</span>}
      </header>

      {!isUndefined(count) && <span className={styles.cardCount}>{formatNumber(count)}</span>}
    </Container>
  );
};

const Home = () => {
  const { data: programs } = useGetAllProgramsQuery(1, 1);
  const { data: codes } = useGetAllCodesQuery(1, 1);
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
        <p className={styles.subtitle}>
          {'//_A portal for codes, programs, and events on Vara and Ethereum Networks, powered by Vara.eth'}
        </p>
      </div>

      <Card title="Programs" SVG={CodeSVG} linkTo={routes.programs} count={programs?.total} />
      <Card title="Codes" SVG={CodeSVG} linkTo={routes.codes} count={codes?.total} />
      <Card title="Messages" SVG={MessageSVG} count={messagesCount} />
      <Card title="Transactions" SVG={TransactionSVG} count={transactions?.total} />
    </div>
  );
};

export { Home };
