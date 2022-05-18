import React, { useEffect, useState, useContext, useCallback } from 'react';
import { MetaFieldsItem } from './MetaFieldsItem';
import { useFormikContext } from 'formik';
import type { MetaFieldsStruct, MetaFieldsValues } from './new-meta-parser';
import { MetaFieldsContext, MetaFieldsContextProvider } from './MetaFieldsContext';
import { Fieldset, EnumSelect } from './styles';
import isObject from 'lodash.isobject';
import { isMetaField, isMetaFieldset } from './new-meta-parser';
import { MetaField } from './MetaField';

const MetaFieldsComponent = () => {
  const formikContext = useFormikContext();
  const metaFieldsContext = useContext(MetaFieldsContext);
  const [firstKey, setFirstKey] = useState<string | undefined>();

  const changeValues = useCallback(
    (key: string | undefined) => {
      if (isMetaFieldset(metaFieldsContext.__root) && metaFieldsContext.__root && metaFieldsContext.__values) {
        let values: MetaFieldsValues | string = metaFieldsContext.__values;
        if (metaFieldsContext.__root.__select && key) {
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
    console.log(metaFieldsContext);
    changeValues(firstKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (metaFieldsContext.__root && isObject(formikContext.values) && '__root' in formikContext.values) {
    return (
      <Fieldset className="first-item">
        {isMetaFieldset(metaFieldsContext.__root) &&
          metaFieldsContext.__root.__select &&
          metaFieldsContext.__root.__fields && (
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

        {isMetaFieldset(metaFieldsContext.__root) && metaFieldsContext.__root?.__fields ? (
          <>
            {metaFieldsContext.__root.__select && firstKey ? (
              <MetaFieldsItem data={metaFieldsContext.__root.__fields[firstKey]} />
            ) : (
              Object.entries(metaFieldsContext.__root.__fields).map(([key, value]) => {
                return <MetaFieldsItem data={value} key={key} />;
              })
            )}
          </>
        ) : (
          isMetaField(metaFieldsContext.__root) && <MetaField value={metaFieldsContext.__root} />
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
