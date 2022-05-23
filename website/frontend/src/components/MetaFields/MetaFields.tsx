import React, { useEffect, useState, useContext, useCallback } from 'react';
import { MetaFieldsItem } from './MetaFieldsItem';
import { useFormikContext } from 'formik';
import type { MetaFieldsStruct, MetaFieldsValues } from './new-meta-parser';
import { MetaFieldsContext, MetaFieldsContextProvider } from './MetaFieldsContext';
import { Fieldset, EnumSelect } from './styles';
import { isMetaField, isMetaFieldset, isMetaFieldsStruct, isMetaValuesStruct } from './new-meta-parser';
import isObject from 'lodash.isobject';

const MetaFieldsComponent = () => {
  const formikContext = useFormikContext();
  const metaFieldsContext = useContext(MetaFieldsContext);
  const [firstKey, setFirstKey] = useState<string | undefined>();

  const changeValues = useCallback(
    (key?: string) => {
      if (isMetaFieldset(metaFieldsContext.__root) && metaFieldsContext.__root) {
        if (isMetaField(metaFieldsContext.__root.__fields)) {
          formikContext.resetForm({
            values: {
              ...(formikContext.values as object),
              __root: '',
            },
          });
        } else if (isObject(metaFieldsContext.__values) && metaFieldsContext.__values) {
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
      }
    },
    [metaFieldsContext.__root, metaFieldsContext.__values, formikContext]
  );

  useEffect(() => {
    changeValues(firstKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderFields = (fields: MetaFieldsStruct) => {
    if (!isMetaFieldset(fields.__root) || !fields.__root?.__fields) {
      return null;
    }

    if (isMetaField(fields.__root.__fields)) {
      return <MetaFieldsItem data={fields.__root.__fields} />;
    }

    return (
      <>
        {fields.__root.__select && firstKey ? (
          <MetaFieldsItem data={fields.__root.__fields[firstKey]} />
        ) : (
          Object.entries(fields.__root.__fields).map(([key, value]) => {
            return <MetaFieldsItem data={value} key={key} />;
          })
        )}
      </>
    );
  };

  if (
    isMetaFieldsStruct(metaFieldsContext) &&
    isMetaValuesStruct(formikContext.values) &&
    formikContext.values.__root !== null
  ) {
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

        {renderFields(metaFieldsContext)}
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
