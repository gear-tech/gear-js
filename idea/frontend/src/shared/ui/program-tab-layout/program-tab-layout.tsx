import styles from './program-tab-layout.module.scss';

type Props = {
  heading: string;
  count: number | undefined;
  renderList: () => JSX.Element;
  renderSearch: () => JSX.Element;
  renderFilters?: () => JSX.Element;
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

      <div>
        <div className={styles.search}>{renderSearch()}</div>
        {renderFilters && renderFilters()}
      </div>
    </div>
  );
}

export { ProgramTabLayout };
