import React, { useEffect, useState } from 'react';
import { useMetaFieldsContext } from './useMetaFieldsContext';
import { isMetaField, isMetaFieldset, MetaFieldset } from './meta-parser';
import type { MetaFieldsItem as TMetaFieldsItem } from './meta-parser';
import { EnumSelect, Fieldset } from './styles';
import { MetaField } from './MetaField';

export function MetaFieldsItem({ data }: { data: TMetaFieldsItem }) {
  const [currentSelected, setCurrentSelected] = useState<string>();
  const changeFormikValues = useMetaFieldsContext(isMetaFieldset(data) ? data : null);

  useEffect(() => {
    if (isMetaFieldset(data) && data.__select && data.__fields) {
      const key = currentSelected ? currentSelected : Object.keys(data.__fields)[0];
      setCurrentSelected(key);
      changeFormikValues(key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSelected, data]);

  const createFieldset = (fieldset: MetaFieldset) => {
    return (
      <Fieldset key={fieldset.__name}>
        {fieldset.__select && fieldset.__fields && (
          <EnumSelect>
            <label>
              Select field from enum <br />
              <select
                onChange={(event) => {
                  setCurrentSelected(event.target.value);
                  changeFormikValues(event.target.value);
                }}
                data-testid={fieldset.__path}
              >
                {Object.entries(fieldset.__fields).map((item) => {
                  return (
                    <option key={item[0]} value={item[0]}>
                      {item[0]}
                    </option>
                  );
                })}
              </select>
            </label>
          </EnumSelect>
        )}
        <legend>{fieldset.__name}</legend>
        {fieldset.__select && currentSelected ? (
          <MetaFieldsItem data={fieldset.__fields[currentSelected]} />
        ) : (
          <>
            {Object.entries(fieldset.__fields).map(([key, value]) => {
              return <MetaFieldsItem data={value} key={key} />;
            })}
          </>
        )}
      </Fieldset>
    );
  };

  if (isMetaField(data)) {
    return <MetaField value={data} />;
  }

  if (isMetaFieldset(data)) {
    return createFieldset(data);
  }

  return (
    <>
      {Object.entries(data).map(([key, value]) => {
        if (isMetaField(value)) {
          return <MetaField value={value} key={key} />;
        }
        if (isMetaFieldset(value)) {
          return createFieldset(value);
        }
      })}
    </>
  );
}
