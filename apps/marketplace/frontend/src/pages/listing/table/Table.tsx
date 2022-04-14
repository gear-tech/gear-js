import styles from './Table.module.scss';

const data = [
  { event: 'Sale', price: 100, from: 'Bob', to: 'Alice', date: 'A day ago', id: 0 },
  { event: 'Transfer', price: null, from: 'Charlie', to: 'Bob', date: '2 days ago', id: 1 },
  { event: 'Transfer', price: null, from: 'Carol', to: 'Charlie', date: 'A week ago', id: 2 },
  { event: 'Minted', price: null, from: null, to: 'Carol', date: '2 weeks ago', id: 3 },
];

function Table() {
  const getRows = () =>
    data.map(({ event, price, from, to, date, id }) => (
      <tr key={id}>
        <td>{event}</td>
        <td>{price}</td>
        <td>{from}</td>
        <td>{to}</td>
        <td>{date}</td>
      </tr>
    ));

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Event</th>
          <th>Price</th>
          <th>From</th>
          <th>To</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>{getRows()}</tbody>
    </table>
  );
}

export default Table;
