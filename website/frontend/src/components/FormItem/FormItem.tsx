import React, { useEffect, useState, ReactNode, createElement } from 'react';
import { Field, useFormikContext } from 'formik';
import type { MetaFormItem, MetaFormStruct } from '../../utils/meta-parser';
import { isMetaFieldset, isMetaField } from '../../utils/meta-parser';
import { MetaInput, Fieldset, EnumSelect } from './styles';

const createMetaFormItem = (data: MetaFormItem) => {
  if (isMetaField(data)) {
    return (
      <label key={data.name}>
        <div>
          {data.label}&nbsp;({data.type})
        </div>
        <Field name={data.name} />
      </label>
    );
  }
  if (isMetaFieldset(data)) {
    return (
      <Fieldset key={data.__name}>
        {data.__select && data.__fields && (
          <EnumSelect>
            <label>
              Select field from enum <br />
              <select>
                {Object.entries(data.__fields).map((item) => {
                  return (
                    <option key={item[0]} data={item[0]}>
                      {item[0]}
                    </option>
                  );
                })}
              </select>
            </label>
          </EnumSelect>
        )}
        <legend>{data.__name}</legend>
        {data.__fields ? createMetaFormItem(data.__fields) : 'No fields'}
      </Fieldset>
    );
  }
  return Object.entries(data).map(([key, value]) => {
    if (isMetaField(value)) {
      return (
        <label key={value.name}>
          <div>
            {value.label}&nbsp;({value.type})
          </div>
          <Field name={value.name} />
        </label>
      );
    }
    if (isMetaFieldset(value)) {
      return (
        <Fieldset key={value.__name}>
          <div>
            {value.__select && value.__fields && (
              <EnumSelect>
                <label>
                  Select field from enum <br />
                  <select>
                    {Object.entries(value.__fields).map((item) => {
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
          </div>
          <legend>{value.__name}</legend>
          {value.__fields ? createMetaFormItem(value.__fields) : 'No fields'}
        </Fieldset>
      );
    }
    return null;
  });
};

export const FormItem = ({ data }: { data: MetaFormStruct }) => {
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
