import React, { useEffect, useState, useContext, useCallback } from 'react';
import { MetaFieldsItem } from './MetaFieldsItem';
import { useFormikContext } from 'formik';
import type { MetaFieldsStruct, MetaFieldsValues } from './meta-parser';
import { MetaFieldsContext, MetaFieldsContextProvider } from './MetaFieldsContext';
import { Fieldset, EnumSelect } from './styles';
import isObject from 'lodash.isobject';

const MetaFieldsComponent = () => {
  const formikContext = useFormikContext();
  const metaFieldsContext = useContext(MetaFieldsContext);
  const [firstKey, setFirstKey] = useState(Object.keys(metaFieldsContext.__root!.__fields!)[0]);

  const changeValues = useCallback(
    (key: string) => {
      if (metaFieldsContext.__root && metaFieldsContext.__values) {
        let values: MetaFieldsValues | string = metaFieldsContext.__values;
        if (metaFieldsContext.__root.__select) {
          values = {
            [key]: metaFieldsContext.__values[key],
          };
        }
        formikContext.resetForm({
          values: {
            ...(formikContext.values as object),
            __root: values,
          },
        });
      }
    },
    [metaFieldsContext.__root, metaFieldsContext.__values, formikContext]
  );

  useEffect(() => {
    changeValues(firstKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (
    metaFieldsContext.__root &&
    isObject(formikContext.values) &&
    '__root' in formikContext.values &&
    // @ts-ignore
    formikContext.values.__root
  ) {
    return (
      <Fieldset className="first-item">
        {metaFieldsContext.__root.__select && metaFieldsContext.__root.__fields && (
          <EnumSelect>
            <label>
              Select field from enum <br />
              <select
                onChange={(event) => {
                  changeValues(event.target.value);
                  setFirstKey(event.target.value);
                }}
                data-testid={metaFieldsContext.__root.__path}
              >
                {Object.entries(metaFieldsContext.__root.__fields).map((item) => {
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

        {metaFieldsContext.__root?.__fields ? (
          <>
            {metaFieldsContext.__root.__select ? (
              <MetaFieldsItem data={metaFieldsContext.__root.__fields[firstKey]} />
            ) : (
              Object.entries(metaFieldsContext.__root.__fields).map(([key, value]) => {
                return <MetaFieldsItem data={value} key={key} />;
              })
            )}
          </>
        ) : (
          'meta data not parsed'
        )}
      </Fieldset>
    );
  }

  return null;
};

export const MetaFields = ({ data }: { data: MetaFieldsStruct }) => {
  return (
    <MetaFieldsContextProvider data={data}>
      <MetaFieldsComponent />
    </MetaFieldsContextProvider>
  );
};
