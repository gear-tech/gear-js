import React, { useEffect, useState, useContext, ReactNode } from 'react';
import { Field, useFormikContext } from 'formik';
import type { MetaField, MetaFieldset, MetaFormItem, MetaFormStruct } from '../../utils/meta-parser';
import { isMetaFieldset, isMetaField, MetaFormItemStruct } from '../../utils/meta-parser';
import { Fieldset, EnumSelect } from './styles';
import isObject from 'lodash.isobject';
import set from 'lodash.set';
import get from 'lodash.get';

const MetaFormContext = React.createContext({});
function MetaFormProvider({ children, data }: { children: ReactNode; data: MetaFormStruct }) {
  return <MetaFormContext.Provider value={data}>{children}</MetaFormContext.Provider>;
}

function getFieldData(field: MetaFieldset, key: string | undefined) {
  if (key && field.__select) {
    return field.__fields[key];
  }
  return field.__fields;
}

function MetaFormField({ value }: { value: MetaField }) {
  return (
    <label key={value.name}>
      <div>
        {value.label}&nbsp;({value.type})
      </div>
      <Field name={value.name} disabled={value.type === 'Null'} />
    </label>
  );
}

function MetaFormFieldset({
  fieldset,
  children,
}: {
  fieldset: MetaFieldset;
  children: (key: string | undefined) => React.ReactNode;
}) {
  const [currentSelected, setCurrentSelected] = useState<string>();
  const formikContext = useFormikContext();
  const ctx = useContext(MetaFormContext);

  const changeFormikValues = (key: string) => {
    if (key) {
      const values = JSON.parse(JSON.stringify(formikContext.values));
      // @ts-ignore
      const val = get(ctx.__values, fieldset.__path.replace('__root.', ''));
      set(values, '__root.' + fieldset.__name, {
        [key]: val[key],
      });
      if (JSON.stringify(formikContext.values !== JSON.stringify(values))) {
        formikContext.resetForm({
          values,
        });
      }
    }
  };

  useEffect(() => {
    if (fieldset.__select && fieldset.__fields) {
      const key = Object.keys(fieldset.__fields)[0];
      setCurrentSelected(key);
      changeFormikValues(key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      {children(currentSelected)}
    </Fieldset>
  );
}

function createMetaFormItem(data: MetaFormItemStruct | MetaFormItem) {
  if (isMetaField(data)) {
    return <MetaFormField value={data} />;
  }
  if (isMetaFieldset(data) && data) {
    return (
      <MetaFormFieldset fieldset={data}>
        {(key) => {
          return data.__fields ? createMetaFormItem(getFieldData(data, key)) : 'No fields';
        }}
      </MetaFormFieldset>
    );
  }

  return Object.entries(data).map(([key, value]) => {
    if (isMetaField(value)) {
      return <MetaFormField value={value} key={key} />;
    }
    if (isMetaFieldset(value)) {
      return (
        <MetaFormFieldset fieldset={value} key={key}>
          {(kKey) => {
            return value.__fields ? createMetaFormItem(getFieldData(value, kKey)) : 'No fields';
          }}
        </MetaFormFieldset>
      );
    }

    return null;
  });
}

export const MetaFields = ({ data }: { data: MetaFormStruct }) => {
  const formikContext = useFormikContext();
  const [firstKey, setFirstKey] = useState(Object.keys(data.__root!.__fields!)[0]);

  useEffect(() => {
    if (data.__root) {
      formikContext.resetForm({
        values: {
          ...(formikContext.values as object),
          __root: getFieldData(data.__root, firstKey),
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(data);

  if (
    data.__root &&
    isObject(formikContext.values) &&
    '__root' in formikContext.values &&
    // @ts-ignore
    formikContext.values.__root
  ) {
    return (
      <MetaFormProvider data={data}>
        <Fieldset className="first-item">
          {data.__root.__select && data.__root.__fields && (
            <EnumSelect>
              <label>
                Select field from enum <br />
                <select
                  onChange={(event) => {
                    setFirstKey(event.target.value);
                  }}
                >
                  {Object.entries(data.__root.__fields).map((item) => {
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

          {data.__root.__fields
            ? createMetaFormItem(data.__root.__select ? data.__root.__fields[firstKey] : data.__root.__fields)
            : 'meta data not parsed'}
        </Fieldset>
      </MetaFormProvider>
    );
  }

  return null;
};
