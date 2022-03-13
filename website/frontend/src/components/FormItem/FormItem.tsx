import React, { useEffect, useState, ReactNode } from 'react';
import isObject from 'lodash.isobject';
import { Field, useFormikContext } from 'formik';
import { ParsedShape, ParsedStruct } from '../../utils/meta-parser';
import { MetaFormItem, MetaInput, Fieldset, EnumSelect } from './styles';

const createFieldset = ({ legend, fields }: { legend: string; fields: ParsedStruct }) => (
  <Fieldset key={legend} name={legend}>
    <legend>{legend}</legend>
    {fields &&
      Object.entries(fields).map((field) => {
        if (field && field[1] && 'type' in field[1] && 'name' in field[1]) {
          return (
            <MetaInput key={field[1].name as string}>
              <label>
                {field[1].label} (type: {field[1].type}) <br />
                {/* TOFIX: uncontrolled input is changing to be controlled */}
                <Field name={field[1].name} /> <br />
              </label>
            </MetaInput>
          );
        }
        if (isObject(field[1])) {
          return createFieldset({
            legend: field[0],
            fields: field[1] as ParsedStruct,
          });
        }
        if (field[1] === null) {
          return <div key={field[1]}>Null</div>;
        }
        return null;
      })}
  </Fieldset>
);

export const FormItem = ({ data }: { data: ParsedShape }) => {
  const formikContext = useFormikContext();
  const [activeEnums, setActiveEnums] = useState<ParsedStruct>({});
  const [result, setResult] = useState<[null | ReactNode, null | ReactNode]>([null, null]);

  useEffect(() => {
    const struct: [null | ReactNode, null | ReactNode] = [null, null];
    if (data.select) {
      struct[0] = Object.entries(data.select).map((item, index) => {
        const { type, fields } = item[1];
        if (type === '_enum') {
          return (
            <EnumSelect key={item[0]}>
              <label>
                Select field from enum <br />
                <select
                  name={item[0]}
                  id={item[0]}
                  key={item[0]}
                  onChange={(event) => {
                    const { value } = event.target;
                    if (data.select && data.values) {
                      const selected = { [`${value}`]: data.select[item[0]].fields[value] };
                      setActiveEnums(selected);
                      formikContext.resetForm({
                        values: {
                          ...(formikContext.values as object),
                          meta: { [`${value}`]: data.values[value] },
                        },
                      });
                    }
                  }}
                >
                  {Object.entries(fields)
                    .reverse()
                    .map((field) => (
                      <option key={`${item[0]}-${field[0]}`} value={field[0]}>
                        {field[0]}
                      </option>
                    ))}
                  {item[1].type === '_enum_Option' && <option value="NoFields">NoFields</option>}
                </select>
              </label>
            </EnumSelect>
          );
        }
        if (type === '_enum_Option') {
          return (
            <EnumSelect key={item[0]}>
              <label>
                Select field from enum <br />
                <select
                  name={item[0]}
                  id={item[0]}
                  key={item[0]}
                  onChange={(event) => {
                    const { value } = event.target;
                    if (value === 'NoFields') {
                      setActiveEnums({
                        NoFields: {
                          type: 'Null',
                          name: 'fields.NoFields',
                          label: 'NoFields',
                        },
                      });
                    } else if (data.select && data.values) {
                      const selected = { [`${value}`]: data.select[item[0]].fields[value] };
                      setActiveEnums({ selected });
                      formikContext.resetForm({
                        values: { ...(formikContext.values as object), meta: { [`${value}`]: data.values[value] } },
                      });
                    }
                  }}
                >
                  {Object.entries(fields)
                    .reverse()
                    .map((field) => (
                      <option key={`${item[0]}-${field[0]}`} value={field[0]}>
                        {field[0]}
                      </option>
                    ))}
                  {item[1].type === '_enum_Option' && <option value="NoFields">NoFields</option>}
                </select>
              </label>
            </EnumSelect>
          );
        }
        if (type === '_enum_Result') {
          return (
            <EnumSelect key={item[0]}>
              <label key={item[0]}>
                Select field from enum <br />
                <select
                  name={item[0]}
                  id={item[0]}
                  key={item[0]}
                  onChange={(event) => {
                    const { value } = event.target;
                    if (value === 'NoFields') {
                      setActiveEnums({
                        NoFields: {
                          type: 'Null',
                          name: 'fields.NoFields',
                          label: 'NoFields',
                        },
                      });
                    } else if (data.select) {
                      setActiveEnums({ [`${value}`]: data.select[item[0]].fields[value] });
                    }
                  }}
                >
                  {Object.entries(fields)
                    .reverse()
                    .map((field) => (
                      <option key={`${item[0]}-${field[0]}`} value={field[0]}>
                        {field[0]}
                      </option>
                    ))}
                  {item[1].type === '_enum_Option' && <option value="NoFields">NoFields</option>}
                </select>
              </label>
            </EnumSelect>
          );
        }
        return null;
      });
    }
    if (data.fields) {
      struct[1] = Object.entries(data.fields).map((item) => {
        if (item[1] !== null && Object.keys(item[1])) {
          return createFieldset({
            legend: item[0],
            fields: {
              [item[0]]: item[1],
            } as ParsedStruct,
            fields: { [item[0]]: item[1] as ParsedStruct },
          });
        }
        return null;
      });
    }
    if (Object.values(activeEnums).length > 0) {
      struct[1] = Object.entries(activeEnums).map((field) => {
        if (field[1] !== null) {
          return createFieldset({
            legend: field[0],
            fields: 'type' in field[1] ? activeEnums : (field[1] as ParsedStruct),
          });
        }
        return null;
      });
    }
    if (JSON.stringify(struct) !== JSON.stringify(result)) {
      setResult(struct);
    }
  }, [activeEnums, data.fields, data.values, data.select, result, formikContext]);

  return <MetaFormItem>{result}</MetaFormItem>;
};
