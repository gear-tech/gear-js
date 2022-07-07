import { useParams } from 'react-router-dom';
import { IdeaEventsProps } from 'types/explorer';
import { BackButton } from 'components/BackButton/BackButton';
import { BlocksSummary } from 'components/BlocksSummary/BlocksSummary';
import { Search } from './children/Search/Search';
import { Events } from './children/Events/Events';
import { Block } from './children/Block/Block';
import styles from './Explorer.module.scss';

const Explorer = ({ events }: IdeaEventsProps) => {
  const { blockId } = useParams();

  return (
    <div className={styles.explorer}>
      <header className={styles.header}>
        <div className={styles.search}>
          <BackButton />
          <Search />
        </div>
        <BlocksSummary />
      </header>
      {blockId ? <Block blockId={blockId} /> : <Events events={events} />}
    </div>
  );
};

export { Explorer };
