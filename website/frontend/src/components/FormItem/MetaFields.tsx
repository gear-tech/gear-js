import React, { useEffect, useState, ReactNode, createElement } from 'react';
import { Field, useFormikContext } from 'formik';
import type { MetaField, MetaFieldset, MetaFormItem, MetaFormStruct } from '../../utils/meta-parser';
import { isMetaFieldset, isMetaField, MetaFormItemStruct } from '../../utils/meta-parser';
import { MetaInput, Fieldset, EnumSelect } from './styles';

function getFieldData(
  field: MetaFieldset, // TODO find out how to set __fields not null
  key: string | undefined
) {
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
      <Field name={value.name} />
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
  useEffect(() => {
    if (fieldset.__select && fieldset.__fields) {
      setCurrentSelected(Object.keys(fieldset.__fields)[0]);
    }
  }, [setCurrentSelected, fieldset.__select, fieldset.__fields]);

  return (
    <Fieldset key={fieldset.__name}>
      {fieldset.__select && fieldset.__fields && (
        <EnumSelect>
          <label>
            Select field from enum <br />
            <select
              onChange={(event) => {
                setCurrentSelected(event.target.value);
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
    formikContext.resetForm({
      values: { ...(formikContext.values as object), meta: data.__values },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (data.__root) {
    return (
      <Fieldset>
        <legend>Metadata</legend>
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
    );
  }

  return null;
};
