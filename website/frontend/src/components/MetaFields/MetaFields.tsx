import React, { useEffect, useState, useContext, ReactNode, useCallback } from 'react';
import { Field, useFormikContext } from 'formik';
import type { MetaField, MetaFieldset, MetaFormItem, MetaFormStruct, MetaFormValues } from '../../utils/meta-parser';
import { isMetaFieldset, isMetaField, MetaFormItemStruct } from '../../utils/meta-parser';
import { Fieldset, EnumSelect } from './styles';
import isObject from 'lodash.isobject';
import get from 'lodash.get';
import setWith from 'lodash.setwith';

const MetaFormContext = React.createContext<MetaFormStruct>({
  __root: null,
  __values: null,
});

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

function useMetaFieldsContext(fieldset: MetaFieldset | null) {
  const formikContext = useFormikContext();
  const ctx = useContext(MetaFormContext);

  const changeFormikValues = (key: string) => {
    if (key && fieldset) {
      const values = JSON.parse(JSON.stringify(formikContext.values));
      const rootlessPath = fieldset.__path.replace('__root.', '');
      const val = get(ctx.__values, rootlessPath);
      if (isObject(val)) {
        setWith(
          values,
          fieldset.__path,
          {
            [key]: val[key],
          },
          Object
        );
      }
      if (JSON.stringify(formikContext.values !== JSON.stringify(values))) {
        formikContext.resetForm({
          values,
        });
      }
    }
  };

  return changeFormikValues;
}

function MetaFormFieldset({
  fieldset,
  children,
}: {
  fieldset: MetaFieldset;
  children: (key: string | undefined) => React.ReactNode;
}) {
  const [currentSelected, setCurrentSelected] = useState<string>();
  const changeFormikValues = useMetaFieldsContext(fieldset);

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

const MetaFieldsComponent = () => {
  const formikContext = useFormikContext();
  const metaFieldsContext = useContext(MetaFormContext);
  const [firstKey, setFirstKey] = useState(Object.keys(metaFieldsContext.__root!.__fields!)[0]);

  const changeValues = useCallback(
    (key: string) => {
      if (metaFieldsContext.__root && metaFieldsContext.__values) {
        let values: MetaFormValues | string = metaFieldsContext.__values;
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

        {metaFieldsContext.__root.__fields
          ? createMetaFormItem(
              metaFieldsContext.__root.__select
                ? metaFieldsContext.__root.__fields[firstKey]
                : metaFieldsContext.__root.__fields
            )
          : 'meta data not parsed'}
      </Fieldset>
    );
  }

  return null;
};

export const MetaFields = ({ data }: { data: MetaFormStruct }) => {
  return (
    <MetaFormProvider data={data}>
      <MetaFieldsComponent />
    </MetaFormProvider>
  );
};
