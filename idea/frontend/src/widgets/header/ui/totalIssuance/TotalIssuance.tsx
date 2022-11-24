import headerStyles from '../Header.module.scss';

type Props = {
  totalIssuance: string;
};

const TotalIssuance = ({ totalIssuance }: Props) => (
  <section>
    <h2 className={headerStyles.title}>Total issuance</h2>
    <div className={headerStyles.content}>
      <span className={headerStyles.value}>{totalIssuance}</span>
      <span>MUnit</span>
    </div>
  </section>
);

export { TotalIssuance };
