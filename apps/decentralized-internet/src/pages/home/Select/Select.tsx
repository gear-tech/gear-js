import styles from './Select.module.scss'

const ACTIONS = {
  GetAll: 'Get All',
  GetById: 'Get by Id',
  GetByName: "Get by name",
  GetByCreator: "Get by creator",
  GetByDescription: "Get by description",
  GetByPattern: "Get by pattern"
}
 type Props ={
  handleSelectedValue:(value:string,)=>void
 }

function Select({handleSelectedValue}:Props) {

  return (
    <div className={styles.heading}>
      <h4 className={styles.headingTitle}>Search by: </h4>
      <select className={styles.select} onChange={(e)=>handleSelectedValue(e.currentTarget.value)}>
        {
          Object.entries(ACTIONS).map(action => <option key={action[0]} value={action[0]}>{action[1]}</option>)
        }
      </select>
    </div>
  );
}

export { Select };


