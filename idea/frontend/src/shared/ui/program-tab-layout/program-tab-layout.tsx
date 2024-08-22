import { ReactNode } from 'react';

import styles from './program-tab-layout.module.scss';

type Props = {
  heading: string;
  count: number | undefined;
  renderList: () => ReactNode;
  renderSearch?: () => ReactNode;
  renderFilters?: () => ReactNode;
};

function ProgramTabLayout({ heading, count, renderList, renderSearch, renderFilters }: Props) {
  return (
    <div className={styles.container}>
      <div>
        <h3 className={styles.heading}>
          {heading}: {count}
        </h3>

        {renderList()}
      </div>

      {(renderSearch || renderFilters) && (
        <div>
          {renderSearch && <div className={styles.search}>{renderSearch()}</div>}
          {renderFilters && renderFilters()}
        </div>
      )}
    </div>
  );
}

export { ProgramTabLayout };
