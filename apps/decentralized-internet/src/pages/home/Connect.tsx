import { useState, useMemo, useEffect } from 'react';
import { Button } from '@gear-js/ui';
import { ApiLoader, Loader } from 'components';
import { useReadConfiq } from '../../hooks';
import { CONTRACT } from '../../consts';
import { bufferString } from '../../assets/metaBuffer';
import styles from './Home.module.scss';
import { Select } from './Select';
import { InputField } from './InputField';



function Connect() {

  /** get metabuffer for const (import { bufferString } from '../../assets/metaBuffer';)
    import wasmAsset from '../../assets/meta/dns.meta.wasm';
    import { useMetadata } from '@gear-js/react-hooks';
    const { metaBuffer } = useMetadata(wasmAsset);
    console.log(metaBuffer?.toString('base64'));   
  */
  const [selectValue, setSelectValue] = useState('GetAll');
  const [inputValue, setInputValue] = useState('');
  // const [typeInput, setTypeInput] = useState('')

  const metaBuffer = useMemo(() => Buffer.from(bufferString, 'base64'), []);

  const { stateAll } = useReadConfiq(metaBuffer, selectValue, inputValue);


  const handleSelectedValue = (value: string,) => {
    setSelectValue(value)
    setInputValue('')
  }
  const getInputValue = (value: string) => {
    setInputValue(value)
  }

  // useEffect(() => {
  //   const hexArray = [
  //     'GetById',
  //     'GetByCreator'
  //   ];
  //   if (hexArray.includes(selectValue)) { setTypeInput('hex') } else { setTypeInput('string') }
  // }, [selectValue])

  useEffect(() => {
    if (stateAll.error) {
      setSelectValue('GetAll')
      setInputValue('')
    }
  }, [stateAll.error])

  const readDataFrom = (urlLink: string | undefined) => {
    if (!urlLink) return;
    window.open(urlLink);
  };

  const getElementValue = useMemo(() => (
    stateAll.state?.Records.length ? stateAll.state?.Records.map(element =>
      <li key={element.id} className={styles.element}>
        <span>{element.id}</span>
        <span>{element.meta.name}</span>
        <span>{element.meta.link}</span>
        <span>{element.meta.description}</span>
        <span>{element.createdBy}</span>
        <Button type="button" text='open' size='small' onClick={() => readDataFrom(element.meta.link)}/>
      </li>
      ) : (<h4>Results wasnt found</h4>)
  ), [stateAll.state?.Records])

  return (
    stateAll.state?.Records ?
      (
        <div className={styles.container}>
          <div className={styles.heading}>
            <h2 className={styles.headingName}>DNS Contract:</h2>
            <h4 className={styles.headingTitle}>{CONTRACT.CONTRACT_ID}</h4>
          </div>

          {stateAll.isStateRead ? (
            <>
              <Select handleSelectedValue={handleSelectedValue} />
              {selectValue !== 'GetAll' &&
                <InputField getInputValue={getInputValue}/>
              }
              {getElementValue}
            </>
          ) : (
            <Loader />
          )}

        </div>
      ) : (
        <ApiLoader />
      )
  );
}

export { Connect };
