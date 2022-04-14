import styles from './Listing.module.scss';
import Table from './table';
import Summary from './summary';
import Details from './details';
import Main from './main';

function Listing() {
  return (
    <>
      <h2 className={styles.heading}>Kitty #200</h2>
      <div className={styles.listing}>
        <Summary />
        <Main />
        <Details />
      </div>
      <Table />
    </>
  );
}

export default Listing;
